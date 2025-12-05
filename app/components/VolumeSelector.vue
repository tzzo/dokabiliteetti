<script setup lang="ts">
import { VOLUME_OPTIONS, type VolumeOption } from '~/types'

const props = defineProps<{
  modelValue: VolumeOption | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: VolumeOption]
}>()

function selectVolume(option: VolumeOption) {
  emit('update:modelValue', option)
}

function isSelected(option: VolumeOption): boolean {
  if (!props.modelValue) return false
  return props.modelValue.value === option.value && props.modelValue.unit === option.unit
}
</script>

<template>
  <div class="volume-selector">
    <button
      v-for="option in VOLUME_OPTIONS"
      :key="option.label"
      type="button"
      class="volume-btn"
      :class="{ 'volume-btn--selected': isSelected(option) }"
      @click="selectVolume(option)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.volume-selector {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.volume-btn {
  flex: 1 1 auto;
  min-width: 70px;
  padding: var(--space-md);
  background-color: transparent;
  border: 3px solid var(--color-border);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-body);
  text-transform: uppercase;
  transition: all var(--transition-fast);
}

.volume-btn:hover {
  background-color: var(--color-text);
  color: var(--color-bg);
}

.volume-btn--selected {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.volume-btn--selected:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}
</style>
