<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return (locales.value as Array<{ code: string; name: string }>).filter(l => l.code !== locale.value)
})

function switchLanguage() {
  const nextLocale = locale.value === 'fi' ? 'en' : 'fi'
  setLocale(nextLocale)
}
</script>

<template>
  <button
    type="button"
    class="language-switcher"
    @click="switchLanguage"
  >
    <span class="locale-current">{{ locale.toUpperCase() }}</span>
  </button>
</template>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 48px;
  padding: 0 var(--space-md);
  font-weight: var(--font-weight-black);
  font-size: var(--font-size-body);
  letter-spacing: 0.1em;
  color: var(--color-text);
  background: transparent;
  border: 3px solid var(--color-border);
  transition: all var(--transition-fast);
}

.language-switcher:hover {
  background-color: var(--color-text);
  color: var(--color-bg);
}

.locale-current {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
