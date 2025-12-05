<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { Drink } from '~/types'

const { t } = useI18n()
const { shareElement } = useScreenshot()

const props = defineProps<{
  drink: Drink
  rank: number
  isBest: boolean
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const itemRef = useTemplateRef<HTMLElement>('itemRef')
const isSharing = ref(false)

function formatPrice(value: number): string {
  return value.toFixed(2)
}

async function handleShare() {
  if (!itemRef.value || isSharing.value) return

  isSharing.value = true
  try {
    await shareElement(itemRef.value, props.drink.name || 'Dokabiliteetti')
  } finally {
    isSharing.value = false
  }
}
</script>

<template>
  <div ref="itemRef" class="drink-item" :class="{ 'drink-item--best': isBest }">
    <div class="drink-rank">{{ rank }}</div>
    <div class="drink-info">
      <span class="drink-name">{{ drink.name || t('list.unnamed') }}</span>
      <span class="drink-details">
        {{ drink.price.toFixed(2) }}€ · {{ drink.alcoholPercent }}%
      </span>
    </div>
    <div class="drink-score">
      <span class="score-value">{{ drink.dokabilityScore }}</span>
    </div>
    <div class="drink-value">
      <span class="drink-price">{{ formatPrice(drink.pricePerClAlcohol) }}</span>
      <span class="drink-unit">€/{{ t('units.cl') }}</span>
    </div>
    <button
      type="button"
      class="action-btn share-btn"
      :disabled="isSharing"
      @click="handleShare"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
    </button>
    <button
      type="button"
      class="action-btn remove-btn"
      :aria-label="'Remove ' + drink.name"
      @click="$emit('remove', drink.id)"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.drink-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  border-bottom: 2px solid var(--color-border);
  background-color: var(--color-bg);
}

.drink-item:last-child {
  border-bottom: none;
}

.drink-item--best {
  background-color: var(--color-success);
  border-bottom-color: var(--color-success);
}

.drink-item--best .drink-name,
.drink-item--best .drink-details,
.drink-item--best .drink-rank,
.drink-item--best .drink-price,
.drink-item--best .drink-unit,
.drink-item--best .score-value {
  color: white;
}

.drink-rank {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-black);
  color: var(--color-text-muted);
  min-width: 40px;
}

.drink-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.drink-name {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.drink-details {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
}

.drink-score {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
}

.score-value {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-black);
  color: var(--color-primary);
}

.drink-value {
  display: flex;
  align-items: baseline;
  gap: var(--space-xs);
}

.drink-price {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-black);
  white-space: nowrap;
}

.drink-unit {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  transition: opacity var(--transition-fast);
  flex-shrink: 0;
}

.action-btn:hover {
  opacity: 0.6;
}

.action-btn:disabled {
  opacity: 0.3;
}

.drink-item--best .action-btn {
  color: white;
}
</style>
