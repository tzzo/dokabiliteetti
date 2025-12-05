<script setup lang="ts">
const props = defineProps<{
  targetRef: HTMLElement | null
  filename?: string
  title?: string
}>()

const { shareElement } = useScreenshot()
const isLoading = ref(false)

async function handleShare() {
  if (!props.targetRef || isLoading.value) return

  isLoading.value = true
  try {
    await shareElement(props.targetRef, props.title || 'Dokabiliteetti')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <button
    type="button"
    class="share-button btn btn-secondary"
    :disabled="!targetRef || isLoading"
    @click="handleShare"
  >
    <svg
      v-if="!isLoading"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
    <svg
      v-else
      class="spinner"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32" />
    </svg>
    <slot />
  </button>
</template>

<style scoped>
.share-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
}

.share-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
