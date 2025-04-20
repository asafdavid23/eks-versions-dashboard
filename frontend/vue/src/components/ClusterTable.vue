<template>
  <div id="app">
    <ClusterTableFilters
      :accounts="accounts"
      :regions="regions"
      :versions="versions"
      v-model:selectedAccount="selectedAccount"
      v-model:selectedRegion="selectedRegion"
      v-model:selectedVersion="selectedVersion"
    />

    <ClusterTableData
      :loading="loading"
      :filteredClusters="filteredClusters"
    />
  </div>
</template>

<script setup lang="ts">
import { useClusters } from '@/composables/useClusters'
import ClusterTableFilters from './ClusterTableFilters.vue'
import ClusterTableData from './ClusterTableData.vue'

const {
  accounts,
  regions,
  versions,
  loading,
  filteredClusters,
  selectedAccount,
  selectedRegion,
  selectedVersion
} = useClusters()
</script>

<style scoped>
#app {
  padding: 2em;
}
#logo {
  height: 40px;
  margin-bottom: 2em;
}
</style>
