<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleTheme"
  >
    <Transition name="fade" mode="out-in">
      <svg
        v-if="isDark"
        key="sun"
        class="icon"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      <svg
        v-else
        key="moon"
        class="icon"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </Transition>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: var(--color-text);
  background: transparent;
  border: 3px solid var(--color-border);
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  background-color: var(--color-text);
  color: var(--color-bg);
}

.icon {
  width: 28px;
  height: 28px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.fade-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.fade-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}
</style>
