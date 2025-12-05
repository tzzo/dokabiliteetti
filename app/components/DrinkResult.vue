<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import type { VolumeOption } from '~/types'

const { t } = useI18n()
const { shareElement } = useScreenshot()

const props = defineProps<{
  pureAlcoholMl: number
  pricePerClAlcohol: number
  mlPerEuro: number
  dokabilityScore: number
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

      <div class="dokability-section">
        <div class="dokability-label">{{ t('result.dokability') }}</div>
        <div class="dokability-score">{{ dokabilityScore }}</div>
        <div class="dokability-scale">
          <div class="scale-bar">
            <div class="scale-pointer" :style="{ left: `${dokabilityScore}%` }">
              <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
                <path d="M8 10L0 0h16L8 10z"/>
              </svg>
            </div>
          </div>
          <div class="scale-labels">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
        <div class="dokability-sub">{{ formatNumber(mlPerEuro, 1) }} {{ t('units.ml') }}/€</div>
      </div>

      <div class="result-divider"></div>

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

.dokability-section {
  margin-bottom: var(--space-lg);
}

.dokability-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-xs);
}

.dokability-score {
  font-size: var(--font-size-hero);
  font-weight: var(--font-weight-black);
  line-height: var(--line-height-tight);
  color: var(--color-primary);
}

.dokability-scale {
  margin-top: var(--space-md);
  width: 100%;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
}

.scale-bar {
  position: relative;
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(to right,
    #ef4444 0%,
    #f97316 25%,
    #eab308 50%,
    #84cc16 75%,
    #22c55e 100%
  );
}

.scale-pointer {
  position: absolute;
  top: -2px;
  transform: translateX(-50%);
  color: var(--color-text);
  transition: left 0.3s ease-out;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-xs);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
}

.dokability-sub {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
  margin-top: var(--space-md);
}

.result-divider {
  height: 2px;
  background-color: var(--color-border);
  margin: var(--space-lg) 0;
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
