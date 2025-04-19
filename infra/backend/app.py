import boto3
import json
import os
import logging
import yaml

SPOKE_ACCOUNTS = [
    {"account_id": "913524936878", "role_name": "terraform-role-poweruser"},
]

def create_logger(name: str = "my_logger", level: str = "INFO") -> logging.Logger:
    numeric_level = getattr(logging, level.upper(), None)
    if not isinstance(numeric_level, int):
        raise ValueError(f"Invalid log level: {level}")

    logger = logging.getLogger(name)
    logger.setLevel(numeric_level)

    if not logger.handlers:
        console_handler = logging.StreamHandler()
        console_handler.setLevel(numeric_level)

        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        console_handler.setFormatter(formatter)

        logger.addHandler(console_handler)

    return logger

# Initialize logger
logger = create_logger("my_app_logger", "debug")

def load_config_from_ssm():
    ssm = boto3.client('ssm')
    try:
        response = ssm.get_parameter(
            Name=os.getenv('SSM_CONFIG_PATH'),
            WithDecryption=True
        )
        return yaml.safe_load(response['Parameter']['Value'])
    except Exception as e:
        print(f"Error loading config from SSM: {e}")
        return {}

def assume_role(account_id, role_name):
    try:
        sts = boto3.client('sts')
        role_arn = f"arn:aws:iam::{account_id}:role/earnix/{role_name}"
        creds = sts.assume_role(
            RoleArn=role_arn,
            RoleSessionName="EKSVersionFetchSession"
        )['Credentials']
    except Exception as e:
        logger.debug(f"Failed to assume role {role_name} for account {account_id}: {e}")
        return None
    
    return creds

def get_eks_clusters_in_region(account, region, creds):
    results = []
    try:
        eks = boto3.client(
            'eks',
            region_name=region,
            aws_access_key_id=creds['AccessKeyId'],
            aws_secret_access_key=creds['SecretAccessKey'],
            aws_session_token=creds['SessionToken']
        )
        logger.info(f"[{account} | {region}] Created EKS client")
    except Exception as e:
        logger.error(f"[{account} | {region}] Failed to create EKS client: {e}")
        return results  # Return empty list on error
    
    try:
        clusters = eks.list_clusters().get('clusters')
        logger.info(f"[{account} | {region}] Found {len(clusters)} clusters")
    except Exception as e:
        logger.error(f"[{account} | {region}] Failed to list clusters: {e}")
        return results  # Return empty list on error
    
    for cluster in clusters:
        try:
            info = eks.describe_cluster(name=cluster)
            cluster_info = {
                "account_id": account,
                "name": cluster,
                "version": info['cluster']['version'],
                "region": region
            }
            results.append(cluster_info)
            logger.info(f"[{account} | {region}] Added cluster {cluster} with version {info['cluster']['version']}")
        except Exception as e:
            logger.error(f"[{account} | {region}] Failed to describe cluster {cluster}: {e}")
    
    return results

def lambda_handler(event, context):
    try:
        all_data = []
        config = load_config_from_ssm()
        
        if not config:
            logger.error("No config found in SSM")
            return {
                "statusCode": 500,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Internal server error: No config found"})
            }
            
        spoke_accounts = config.get('spoke_accounts', SPOKE_ACCOUNTS)
        
        logger.debug(f"Received spoke_accounts: {spoke_accounts}")
        
        for account in spoke_accounts:
            account_id = account['account_id']
            role_name = account['role_name']
                        
            creds = assume_role(account_id, role_name)
            
            if not creds:
                logger.debug(f"Failed to assume role {role_name} for account {account_id}")
                continue  # <-- important
                
            for region in account.get('regions', []):
                clusters = get_eks_clusters_in_region(account_id, region, creds)
                all_data.extend(clusters)

        if not all_data:
            return {
                "statusCode": 404,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "No clusters found"})
            }

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"clusters": all_data})
        }
    except Exception as e:
        logger.error(f"Unhandled error in Lambda handler: {str(e)}", exc_info=True)
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": f"Internal server error: {str(e)}"})
        }