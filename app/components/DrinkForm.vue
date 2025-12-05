<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { VolumeOption } from '~/types'
import { getDefaultAlcoholPercent } from '~/types'

const { t } = useI18n()
const { calculate } = useAlcoholCalculator()

const emit = defineEmits<{
  calculated: [result: { pureAlcoholMl: number; pricePerClAlcohol: number; mlPerEuro: number; dokabilityScore: number; price: number; volume: VolumeOption; alcoholPercent: number }]
}>()

const priceInput = ref('')
const price = computed(() => {
  if (!priceInput.value) return null
  // Handle both comma and dot as decimal separator
  const sanitized = priceInput.value.replace(',', '.').replace(/[^\d.]/g, '')
  const parsed = parseFloat(sanitized)
  return isNaN(parsed) ? null : parsed
})
const selectedVolume = ref<VolumeOption | null>(null)
const alcoholPercent = ref(5.0)

watch(selectedVolume, (newVolume) => {
  if (newVolume) {
    alcoholPercent.value = getDefaultAlcoholPercent(newVolume)
  }
})

const canCalculate = computed(() => {
  return price.value !== null && price.value > 0 && selectedVolume.value !== null
})

function handleCalculate() {
  if (!canCalculate.value || !selectedVolume.value || price.value === null) return

  const result = calculate(
    price.value,
    selectedVolume.value.value,
    selectedVolume.value.unit,
    alcoholPercent.value
  )

  emit('calculated', {
    pureAlcoholMl: result.pureAlcoholMl,
    pricePerClAlcohol: result.pricePerClAlcohol,
    mlPerEuro: result.mlPerEuro,
    dokabilityScore: result.dokabilityScore,
    price: price.value,
    volume: selectedVolume.value,
    alcoholPercent: alcoholPercent.value
  })
}
</script>

<template>
  <form class="drink-form" @submit.prevent="handleCalculate">
    <div class="form-group">
      <label class="label">{{ t('form.price') }}</label>
      <div class="price-input-wrapper">
        <input
          v-model="priceInput"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          class="input"
          :placeholder="t('form.pricePlaceholder')"
        >
        <span class="price-suffix">€</span>
      </div>
    </div>

    <div class="form-group">
      <label class="label">{{ t('form.volume') }}</label>
      <VolumeSelector v-model="selectedVolume" />
    </div>

    <div class="form-group">
      <label class="label">{{ t('form.alcohol') }}</label>
      <WheelPicker
        v-model="alcoholPercent"
        :min="0"
        :max="100"
        :step="0.1"
        suffix="%"
      />
    </div>

    <button
      type="submit"
      class="btn btn-primary calculate-btn"
      :disabled="!canCalculate"
    >
      {{ t('form.calculate') }}
    </button>
  </form>
</template>

<style scoped>
.drink-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.price-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.price-input-wrapper .input {
  padding-right: 3rem;
}

.price-suffix {
  position: absolute;
  right: var(--space-md);
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-black);
}

.calculate-btn {
  width: 100%;
  padding: var(--space-lg);
  font-size: var(--font-size-h1);
  margin: var(--space-md) 0 var(--space-xl);
}

.calculate-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
