<template>
  <div id="app">
    <header>
      <img src="/earnix_logo.svg" alt="Earnix Logo" id="logo" />
    </header>
    
    <!-- Filters Section -->
    <div class="filter-container">
      <div class="filters">
        <label>
          Account:
          <select v-model="selectedAccount">
            <option value="">All</option>
            <option v-for="acc in accounts" :key="acc" :value="acc">{{ acc }}</option>
          </select>
        </label>

        <label>
          Region:
          <select v-model="selectedRegion">
            <option value="">All</option>
            <option v-for="reg in regions" :key="reg" :value="reg">{{ reg }}</option>
          </select>
        </label>
        <label>
          Version:
          <select v-model="selectedVersion">
            <option value="">All</option>
            <option v-for="v in versions" :key="v" :value="v">{{ v }}</option>
          </select>
        </label>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading">Loading...</div>

    <!-- Cluster Table -->
    <table v-else-if="clusters.length > 0">
      <thead>
        <tr>
          <th>Cluster Name</th>
          <th>Kubernetes Version</th>
          <th>Region</th>
          <th>Account</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cluster in filteredClusters" :key="cluster.name">
          <td>{{ cluster.name }}</td>
          <td>{{ cluster.version }}</td>
          <td>{{ cluster.region }}</td>
          <td>{{ cluster.account }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>No clusters found.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import { computed } from 'vue'

interface Cluster {
  name: string
  version: string
  region: string
  account: string
}

export default defineComponent({
  name: 'ClusterTable',
  setup() {
    const clusters = ref<Cluster[]>([])
    const accounts = ref<string[]>([])
    const regions = ref<string[]>([])
    const clustersNames = ref<string[]>([])
    const versions = ref<string[]>([])
    const selectedVersion = ref('')
    const loading = ref(false)
    const apiKey = import.meta.env.VITE_API_KEY || ''
    const stage = import.meta.env.VITE_API_STAGE || ''
    const url = import.meta.env.VITE_APP_BACKEND_URL
    const fqdn = `${url}/${stage}/api/eks/clusters`
    const headers = {
      'X-API-Key': apiKey,
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }

    console.log('URL:', url)
    console.log('FQDN:', fqdn)

    const selectedAccount = ref('')
    const selectedRegion = ref('')
    const selectedCluster = ref('')

    const fetchClusters = async () => {
      loading.value = true
      try {
        const response = await axios.get(fqdn, {headers})

        console.log('Raw response:', response)
        console.log('Raw data:', response.data)

        const rawClusters = response.data.clusters || []

        const normalizedClusters: Cluster[] = rawClusters.map((c: any) => ({
          name: c.name,
          version: c.version,
          region: c.region,
          account: c.account_id
        }))

        clusters.value = normalizedClusters

        // Ensure versions are strings
        const allVersions = [...new Set(normalizedClusters.map(c => c.version))]
        versions.value = allVersions.sort()

        const allAccounts = [...new Set(normalizedClusters.map(c => c.account))]
        accounts.value = allAccounts.sort()

        const allRegions = [...new Set(normalizedClusters.map(c => c.region))]
        regions.value = allRegions.sort()
      } catch (err) {
        console.error('Failed to fetch clusters:', err)
        clusters.value = []
      } finally {
        loading.value = false
      }
    }

    const filteredClusters = computed(() => {
      return clusters.value.filter(cluster => {
        const accountMatch = selectedAccount.value === '' || cluster.account === selectedAccount.value
        const regionMatch = selectedRegion.value === '' || cluster.region === selectedRegion.value
        const versionMatch = selectedVersion.value === '' || cluster.version === selectedVersion.value
        const clusterMatch = selectedCluster.value === '' || cluster.name === selectedCluster.value

        return accountMatch && regionMatch && versionMatch && clusterMatch
      })
    })

    // const fetchAccounts = async () => {
    //   try {
    //     const response = await axios.get('/accounts.json') // Loads from public/accounts.json
    //     accounts.value = response.data.accounts || []
    //   } catch (err) {
    //     console.error('Failed to load accounts.json:', err)
    //   }
    // }

    // const fetchRegions = async () => {
    //   try {
    //     const response = await axios.get('/regions.json') // Loads from public/regions.json
    //     regions.value = response.data.regions || []
    //   } catch (err) {
    //     console.error('Failed to load regions.json:', err)
    //   }
    // }

    // Initial load
    onMounted(() => {
      // fetchAccounts()
      fetchClusters()
      // fetchRegions()
    })

    return {
      clusters,
      accounts,
      regions,
      selectedAccount,
      selectedRegion,
      selectedCluster,
      clustersNames,
      filteredClusters,
      loading,
      versions,
      selectedVersion
    }
  }
})
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1em;
}
th, td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
}
label {
  display: flex;
  flex-direction: column;
}
</style>