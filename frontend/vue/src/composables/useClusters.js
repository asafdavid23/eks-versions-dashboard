import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
export function useClusters() {
    const clusters = ref([]);
    const accounts = ref([]);
    const regions = ref([]);
    const versions = ref([]);
    const selectedAccount = ref('');
    const selectedRegion = ref('');
    const selectedCluster = ref('');
    const selectedVersion = ref('');
    const loading = ref(false);
    const apiKey = import.meta.env.VITE_API_KEY || '';
    const stage = import.meta.env.VITE_API_STAGE || '';
    const url = import.meta.env.VITE_APP_BACKEND_URL;
    const fqdn = `${url}/${stage}/api/eks/clusters`;
    const headers = {
        'X-API-Key': apiKey,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    };
    const fetchClusters = async () => {
        loading.value = true;
        try {
            const response = await axios.get(fqdn, { headers });
            const rawClusters = response.data.clusters || [];
            const normalizedClusters = rawClusters.map((c) => ({
                name: c.name,
                version: c.version,
                region: c.region,
                account: c.account_id,
            }));
            clusters.value = normalizedClusters;
            versions.value = [...new Set(normalizedClusters.map(c => c.version))].sort();
            accounts.value = [...new Set(normalizedClusters.map(c => c.account))].sort();
            regions.value = [...new Set(normalizedClusters.map(c => c.region))].sort();
        }
        catch (err) {
            console.error('Failed to fetch clusters:', err);
            clusters.value = [];
        }
        finally {
            loading.value = false;
        }
    };
    const filteredClusters = computed(() => clusters.value.filter(cluster => {
        const matchesAccount = !selectedAccount.value || cluster.account === selectedAccount.value;
        const matchesRegion = !selectedRegion.value || cluster.region === selectedRegion.value;
        const matchesVersion = !selectedVersion.value || cluster.version === selectedVersion.value;
        const matchesName = !selectedCluster.value || cluster.name === selectedCluster.value;
        return matchesAccount && matchesRegion && matchesVersion && matchesName;
    }));
    onMounted(fetchClusters);
    return {
        clusters,
        accounts,
        regions,
        versions,
        loading,
        filteredClusters,
        selectedAccount,
        selectedRegion,
        selectedVersion,
        selectedCluster,
    };
}
