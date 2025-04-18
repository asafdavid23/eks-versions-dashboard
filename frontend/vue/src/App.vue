<template>
  <div id="app">
    <h1>EKS Clusters</h1>
    <ClusterTable :clusters="clusters" />
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ClusterTable from './components/ClusterTable.vue'

interface Cluster {
  name: string
  version: string
  region: string
}

export default {
  name: 'App',
  components: {
    ClusterTable
  },
  setup() {
    const clusters = ref<Cluster[]>([])

    // Fetch EKS clusters from the backend API (Lambda via API Gateway)
    const fetchClusters = async () => {
      try {
        const response = await axios.get<{ data: Cluster[] }>('http://localhost:3000/api/eks/clusters')
        clusters.value = response.data
      } catch (error) {
        console.error('Error fetching clusters:', error)
      }
    }

    onMounted(fetchClusters)

    return {
      clusters
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>
