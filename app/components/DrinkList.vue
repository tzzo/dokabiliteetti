<script setup lang="ts">
import { useTemplateRef } from 'vue'

const { t } = useI18n()
const { drinks, drinkCount, isListOpen, toggleList, clearAllDrinks, removeDrink, isBestValue } = useDrinks()
const { shareElement } = useScreenshot()

const listRef = useTemplateRef<HTMLElement>('listRef')
const isSharing = ref(false)

async function handleShareComparison() {
  if (!listRef.value || isSharing.value) return

  isSharing.value = true
  try {
    await shareElement(listRef.value, t('list.title'))
  } finally {
    isSharing.value = false
  }
}
</script>

<template>
  <div v-if="drinkCount > 0" class="drink-list">
    <button
      type="button"
      class="list-header"
      @click="toggleList"
    >
      <span class="list-toggle">
        <svg
          class="toggle-icon"
          :class="{ 'toggle-icon--open': isListOpen }"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
      <span class="list-title">{{ t('list.title').toUpperCase() }}</span>
      <span class="list-count">({{ drinkCount }})</span>
    </button>

    <Transition name="slide">
      <div v-if="isListOpen" class="list-content">
        <div ref="listRef" class="list-items">
          <DrinkListItem
            v-for="(drink, index) in drinks"
            :key="drink.id"
            :drink="drink"
            :rank="index + 1"
            :is-best="isBestValue(drink)"
            @remove="removeDrink"
          />
        </div>

        <div class="list-actions">
          <button
            type="button"
            class="btn btn-secondary"
            :disabled="isSharing"
            @click="handleShareComparison"
          >
            {{ isSharing ? '...' : t('list.shareComparison') }}
          </button>
          <button
            type="button"
            class="btn btn-secondary clear-btn"
            @click="clearAllDrinks"
          >
            {{ t('list.clear') }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.drink-list {
  border-top: 3px solid var(--color-border);
  margin-top: var(--space-xl);
}

.list-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-lg) 0;
  text-align: left;
  background: transparent;
  border: none;
  transition: opacity var(--transition-fast);
}

.list-header:hover {
  opacity: 0.7;
}

.toggle-icon {
  transition: transform var(--transition-fast);
}

.toggle-icon--open {
  transform: rotate(180deg);
}

.list-title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-black);
  letter-spacing: 0.05em;
}

.list-count {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
}

.list-content {
  padding-bottom: var(--space-xl);
}

.list-items {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: var(--space-lg);
  background-color: var(--color-bg);
}

.list-actions {
  display: flex;
  gap: var(--space-sm);
}

.list-actions .btn {
  flex: 1;
}

.list-actions .btn:disabled {
  opacity: 0.3;
}

.clear-btn {
  color: var(--color-text-muted);
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: all var(--transition-normal);
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 1000px;
}
</style>
