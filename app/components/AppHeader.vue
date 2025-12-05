<script setup lang="ts">
</script>

<template>
  <header class="app-header">
    <LanguageSwitcher />
    <ThemeToggle />
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 var(--space-md) 0;
  border-bottom: 3px solid var(--color-border);
}
</style>
