import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import { computed } from 'vue';
export default defineComponent({
    name: 'ClusterTable',
    setup() {
        const clusters = ref([]);
        const accounts = ref([]);
        const regions = ref([]);
        const clustersNames = ref([]);
        const loading = ref(false);
        const selectedAccount = ref('');
        const selectedRegion = ref('');
        const selectedCluster = ref('');
        const fetchClusters = async () => {
            loading.value = true;
            try {
                const response = await axios.get('http://localhost:3000/api/eks/clusters');
                console.log('Raw response:', response);
                console.log('Raw data:', response.data);
                const rawClusters = response.data.clusters || [];
                const normalizedClusters = rawClusters.map((c) => ({
                    name: c.name,
                    version: c.version,
                    region: c.region,
                    account: c.account_id
                }));
                clusters.value = normalizedClusters;
            }
            catch (err) {
                console.error('Failed to fetch clusters:', err);
                clusters.value = [];
            }
            finally {
                loading.value = false;
            }
        };
        const filteredClusters = computed(() => {
            return clusters.value.filter(cluster => {
                const accountMatch = selectedAccount.value === '' || cluster.account === selectedAccount.value;
                const regionMatch = selectedRegion.value === '' || cluster.region === selectedRegion.value;
                const clusterMatch = selectedCluster.value === '' || cluster.name === selectedCluster.value;
                return accountMatch && regionMatch && clusterMatch;
            });
        });
        // const fetchAccounts = async () => {
        //   try {
        //     const response = await axios.get('http://localhost:3000/api/accounts')
        //     accounts.value = response.data || []
        //   } catch (err) {
        //     console.error('Failed to fetch accounts:', err)
        //   }
        // }
        const fetchAccounts = async () => {
            try {
                const response = await axios.get('/accounts.json'); // Loads from public/accounts.json
                accounts.value = response.data.accounts || [];
            }
            catch (err) {
                console.error('Failed to load accounts.json:', err);
            }
        };
        const fetchRegions = async () => {
            try {
                const response = await axios.get('/regions.json'); // Loads from public/regions.json
                regions.value = response.data.regions || [];
            }
            catch (err) {
                console.error('Failed to load regions.json:', err);
            }
        };
        // Initial load
        onMounted(() => {
            fetchAccounts();
            fetchClusters();
            fetchRegions();
        });
        return {
            clusters,
            accounts,
            regions,
            selectedAccount,
            selectedRegion,
            selectedCluster,
            clustersNames,
            filteredClusters,
            loading
        };
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filters" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.selectedAccount),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [acc] of __VLS_getVForSourceType((__VLS_ctx.accounts))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (acc),
        value: (acc),
    });
    (acc);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.selectedRegion),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [reg] of __VLS_getVForSourceType((__VLS_ctx.regions))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (reg),
        value: (reg),
    });
    (reg);
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
}
else if (__VLS_ctx.clusters.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
    for (const [cluster] of __VLS_getVForSourceType((__VLS_ctx.filteredClusters))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
            key: (cluster.name),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (cluster.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (cluster.version);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (cluster.region);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (cluster.account);
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
/** @type {__VLS_StyleScopedClasses['filters']} */ ;
var __VLS_dollars;
let __VLS_self;
