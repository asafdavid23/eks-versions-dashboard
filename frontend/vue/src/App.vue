<template>
  <div id="app">
    <header>
      <img src="/earnix_logo.svg" alt="Earnix Logo" id="logo" />
      <h1>Earnix EKS Dashboard</h1>
    </header>
    <ClusterTable />
  </div>
</template>

<script setup lang="ts">
import ClusterTable from './components/ClusterTable.vue'
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  padding: 1em;
}
header {
  display: flex;
  align-items: center;
  gap: 1em;
  justify-content: center;
  margin-bottom: 1em;
}
#logo {
  height: 40px;
}
</style>
