# EKS Versions Dashboard

A simple serverless dashboard to display **EKS clusters** across **multiple AWS accounts and regions**, including their **Kubernetes versions**.

## 🧩 Features

- Cross-account and cross-region EKS discovery  
- Displays cluster name, region, version, and account ID  
- Vue.js frontend (S3 + CloudFront)  
- Python backend (AWS Lambda via API Gateway)  

## 🚀 Deploy

### Backend (Python + AWS SAM)

1. Navigate to the backend folder and deploy using AWS SAM:

    ```bash
    cd backend
    sam build
    sam deploy --guided
    ```

2. During deployment, set the following environment variables:

    - `SPOKE_ROLE_ARNS`: Comma-separated list of IAM role ARNs
    - `REGIONS`: Optional. Comma-separated list of AWS regions (defaults to all regions)

### Frontend (Vue.js)

1. Navigate to the frontend folder, install dependencies, and build:

    ```bash
    cd frontend
    npm install
    npm run build
    ```

2. Sync the build output to your S3 bucket:

    ```bash
    aws s3 sync dist/ s3://<your-bucket-name> --delete
    ```

3. (Optional) Set up CloudFront for CDN and HTTPS access.

## 🔧 Requirements

- Node.js (for frontend)
- Python 3.x (for backend)
- AWS CLI & AWS SAM CLI
- IAM roles in spoke accounts with `eks:ListClusters` and `eks:DescribeCluster` permissions

## 👤 Maintainer

[Asaf David](https://github.com/asafdavid23)
