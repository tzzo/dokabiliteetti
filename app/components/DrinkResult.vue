<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import type { VolumeOption } from '~/types'

const { t } = useI18n()
const { shareElement } = useScreenshot()

const props = defineProps<{
  pureAlcoholMl: number
  pricePerClAlcohol: number
  price: number
  volume: VolumeOption
  alcoholPercent: number
}>()

const emit = defineEmits<{
  save: [name: string]
}>()

const drinkName = ref('')
const captureRef = useTemplateRef<HTMLElement>('captureRef')
const isSharing = ref(false)

function handleSave() {
  emit('save', drinkName.value)
  drinkName.value = ''
}

async function handleShare() {
  if (!captureRef.value || isSharing.value) return

  isSharing.value = true
  try {
    await shareElement(captureRef.value, 'Dokabiliteetti')
  } finally {
    isSharing.value = false
  }
}

function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals)
}
</script>

<template>
  <div class="drink-result">
    <div ref="captureRef" class="result-display">
      <div v-if="drinkName" class="result-name">{{ drinkName }}</div>
      <div class="result-label">{{ t('result.pricePerCl') }}</div>
      <div class="result-value">
        <span class="result-number">{{ formatNumber(pricePerClAlcohol) }}</span>
        <span class="result-unit">€/{{ t('units.cl') }}</span>
      </div>
      <div class="result-meta">
        {{ formatNumber(pureAlcoholMl, 1) }} {{ t('units.ml') }} {{ t('result.pureAlcohol').toLowerCase() }}
      </div>
    </div>

    <div class="result-actions">
      <input
        v-model="drinkName"
        type="text"
        class="input name-input"
        :placeholder="t('result.namePlaceholder')"
      >

      <div class="action-buttons">
        <button
          type="button"
          class="btn btn-secondary"
          :disabled="isSharing"
          @click="handleShare"
        >
          {{ isSharing ? '...' : t('result.share') }}
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="handleSave"
        >
          {{ t('result.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drink-result {
  border-top: 3px solid var(--color-border);
  padding-top: var(--space-xl);
}

.result-display {
  text-align: center;
  padding: var(--space-xl) var(--space-md);
  background-color: var(--color-bg);
}

.result-name {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-black);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-bottom: var(--space-md);
}

.result-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-sm);
}

.result-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: var(--space-sm);
}

.result-number {
  font-size: var(--font-size-hero);
  font-weight: var(--font-weight-black);
  line-height: var(--line-height-tight);
  color: var(--color-primary);
}

.result-unit {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
}

.result-meta {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  margin-top: var(--space-md);
}

.result-actions {
  margin-top: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.name-input {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
}

.action-buttons {
  display: flex;
  gap: var(--space-sm);
}

.action-buttons .btn {
  flex: 1;
}

.action-buttons .btn:disabled {
  opacity: 0.3;
}
</style>
