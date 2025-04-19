<template>
  <div class="filters">
    <label>
      Account:
      <select :value="selectedAccount" @change="$emit('update:selectedAccount', ($event.target as HTMLSelectElement)?.value)">
        <option value="">All</option>
        <option v-for="acc in accounts" :key="acc" :value="acc">{{ acc }}</option>
      </select>
    </label>

    <label>
      Region:
      <select :value="selectedRegion" @change="$emit('update:selectedRegion', ($event.target as HTMLSelectElement)?.value)">
        <option value="">All</option>
        <option v-for="reg in regions" :key="reg" :value="reg">{{ reg }}</option>
      </select>
    </label>

    <label>
      Version:
      <select :value="selectedVersion" @change="$emit('update:selectedVersion', ($event.target as HTMLSelectElement)?.value)">
        <option value="">All</option>
        <option v-for="v in versions" :key="v" :value="v">{{ v }}</option>
      </select>
    </label>
  </div>
</template>

<script setup lang="ts">

    defineProps<{
        accounts: string[]
        regions: string[]
        versions: string[]
        selectedAccount: string
        selectedRegion: string
        selectedVersion: string
    }>()

    defineEmits<{
        (e: 'update:selectedAccount', value: string): void
        (e: 'update:selectedRegion', value: string): void
        (e: 'update:selectedVersion', value: string): void
    }>()
</script>

<style scoped>
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
