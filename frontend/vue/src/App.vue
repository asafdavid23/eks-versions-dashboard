<template>
  <div id="app">
    <h1>EKS Clusters</h1>
    <ClusterTable :clusters="clusters" />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
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
