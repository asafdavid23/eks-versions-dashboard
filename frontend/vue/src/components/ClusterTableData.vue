<template>
  <div>
    <!-- Show loading state -->
    <div v-if="props.loading">Loading...</div>

    <!-- Show table if there are filtered clusters -->
    <table v-else-if="props.filteredClusters.length">
      <thead>
        <tr>
          <th @click="sortTable('name')">
            Cluster Name
            <span v-if="sortKey === 'name'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th @click="sortTable('version')">
            Kubernetes Version
            <span v-if="sortKey === 'version'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th @click="sortTable('region')">
            Region
            <span v-if="sortKey === 'region'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th @click="sortTable('account')">
            Account
            <span v-if="sortKey === 'account'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cluster in sortedClusters" :key="cluster.name">
          <td>{{ cluster.name }}</td>
          <td>{{ cluster.version }}</td>
          <td>{{ cluster.region }}</td>
          <td>{{ cluster.account }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Show message when no clusters are found -->
    <p v-else>No clusters found.</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Cluster } from '@/types/Cluster'

// Directly define props in the `script setup` block
const props = defineProps<{
  loading: boolean
  filteredClusters: Cluster[]
}>()

// Sorting state
const sortKey = ref<string>('name')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Function to toggle sorting direction
const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

// Sorting logic for the table
const sortedClusters = computed(() => {
  const clusters = [...props.filteredClusters]

  // Sorting logic based on sortKey and sortDirection
  clusters.sort((a, b) => {
    const aValue = a[sortKey.value as keyof Cluster]
    const bValue = b[sortKey.value as keyof Cluster]

    // Ascending sort
    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })

  return clusters
})

// Function to handle table header click
const sortTable = (key: string) => {
  if (sortKey.value === key) {
    // If already sorting by this key, toggle direction
    toggleSortDirection()
  } else {
    // Else, sort by the new column in ascending order
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}
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
  margin-left: 5px;
  font-size: 0.8em;
}
</style>
