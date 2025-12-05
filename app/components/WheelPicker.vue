<script setup lang="ts">
import { computed } from 'vue'
import { VueScrollPicker } from 'vue-scroll-picker'
import 'vue-scroll-picker/style.css'

const props = withDefaults(defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  suffix?: string
}>(), {
  min: 0,
  max: 100,
  step: 0.5,
  suffix: '%'
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const options = computed(() => {
  const result: { name: string; value: number }[] = []
  for (let v = props.min; v <= props.max; v = parseFloat((v + props.step).toFixed(1))) {
    result.push({
      name: v.toFixed(1) + props.suffix,
      value: v
    })
  }
  return result
})

function handleUpdate(value: number) {
  emit('update:modelValue', value)
  if ('vibrate' in navigator) {
    navigator.vibrate(5)
  }
}
</script>

<template>
  <div class="wheel-picker-container">
    <VueScrollPicker
      :model-value="modelValue"
      :options="options"
      :drag-sensitivity="1.7"
      :touch-sensitivity="1.7"
      :wheel-sensitivity="1"
      @update:model-value="handleUpdate"
    />
  </div>
</template>

<style scoped>
.wheel-picker-container {
  position: relative;
  height: 240px;
  overflow: hidden;
  border: 3px solid var(--color-border);
  background-color: var(--color-bg);
}

.wheel-picker-container :deep(.vue-scroll-picker) {
  height: 100%;
}

/* Individual items */
.wheel-picker-container :deep(.vue-scroll-picker-item) {
  height: 56px !important;
  font-size: var(--font-size-h1) !important;
  font-weight: var(--font-weight-bold) !important;
  color: var(--color-text-muted) !important;
  cursor: grab;
  line-height: 56px !important;
}

.wheel-picker-container :deep(.vue-scroll-picker-item[aria-selected=true]) {
  color: var(--color-text) !important;
  font-size: var(--font-size-display) !important;
  font-weight: var(--font-weight-black) !important;
}

/* Override gradient overlays */
.wheel-picker-container :deep(.vue-scroll-picker-layer-top) {
  background: linear-gradient(to bottom, var(--color-bg) 0%, transparent 100%) !important;
  border: none !important;
}

.wheel-picker-container :deep(.vue-scroll-picker-layer-bottom) {
  background: linear-gradient(to top, var(--color-bg) 0%, transparent 100%) !important;
  border: none !important;
}

/* Selection highlight bar */
.wheel-picker-container :deep(.vue-scroll-picker-layer-selection) {
  border: none !important;
}
</style>
