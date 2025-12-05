<script setup lang="ts">
import { ref, nextTick, useTemplateRef } from 'vue'
import type { VolumeOption } from '~/types'

const { t } = useI18n()
const { initialize } = useTheme()
const { addDrink } = useDrinks()

const resultRef = useTemplateRef<HTMLElement>('resultRef')
const listRef = useTemplateRef<HTMLElement>('listRef')

onMounted(() => {
  initialize()
})

const currentResult = ref<{
  pureAlcoholMl: number
  pricePerClAlcohol: number
  mlPerEuro: number
  dokabilityScore: number
  price: number
  volume: VolumeOption
  alcoholPercent: number
} | null>(null)

async function handleCalculated(result: {
  pureAlcoholMl: number
  pricePerClAlcohol: number
  mlPerEuro: number
  dokabilityScore: number
  price: number
  volume: VolumeOption
  alcoholPercent: number
}) {
  currentResult.value = result
  await nextTick()
  resultRef.value?.$el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function handleSave(name: string) {
  if (!currentResult.value) return

  addDrink(
    name,
    currentResult.value.price,
    currentResult.value.volume,
    currentResult.value.alcoholPercent,
    currentResult.value.pureAlcoholMl,
    currentResult.value.pricePerClAlcohol,
    currentResult.value.mlPerEuro,
    currentResult.value.dokabilityScore
  )
  await nextTick()
  listRef.value?.$el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="container">
    <AppHeader />

    <main class="main">
      <ClientOnly>
        <h1 class="title">
          <span class="title-line title-line--wide">
            <span class="letter" style="--i: 0">D</span><span class="letter" style="--i: 1">O</span><span class="letter" style="--i: 2">K</span><span class="letter" style="--i: 3">A</span>
          </span>
          <span class="title-line title-line--extra-wide">
            <span class="letter" style="--i: 4">B</span><span class="letter" style="--i: 5">I</span><span class="letter" style="--i: 6">L</span><span class="letter" style="--i: 7">I</span>
          </span>
          <span class="title-line title-line--normal">
            <span class="letter" style="--i: 8">T</span><span class="letter" style="--i: 9">E</span><span class="letter" style="--i: 10">E</span><span class="letter" style="--i: 11">T</span><span class="letter" style="--i: 12">T</span><span class="letter" style="--i: 13">I</span>
          </span>
        </h1>
        <template #fallback>
          <h1 class="title title--static">DOKA<br>BILI<br>TEETTI</h1>
        </template>
      </ClientOnly>

      <div class="calculator-section">
        <DrinkForm @calculated="handleCalculated" />
      </div>

      <Transition name="fade">
        <DrinkResult
          v-if="currentResult"
          ref="resultRef"
          :pure-alcohol-ml="currentResult.pureAlcoholMl"
          :price-per-cl-alcohol="currentResult.pricePerClAlcohol"
          :ml-per-euro="currentResult.mlPerEuro"
          :dokability-score="currentResult.dokabilityScore"
          :price="currentResult.price"
          :volume="currentResult.volume"
          :alcohol-percent="currentResult.alcoholPercent"
          @save="handleSave"
        />
      </Transition>

      <DrinkList ref="listRef" />
    </main>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
}

.title {
  font-family: 'Archivo', sans-serif;
  font-size: var(--font-size-hero);
  line-height: var(--line-height-tight);
  margin: var(--space-lg) 0;
  text-transform: uppercase;
  text-align: left;
  overflow: hidden;
}

.title-line {
  display: block;
  text-align: left;
}

.title-line--wide .letter {
  --base-width: 125;
}

.title-line--extra-wide {
  transform: scaleX(1.5);
  transform-origin: left;
  overflow: hidden;
}

.title-line--extra-wide .letter {
  --base-width: 125;
}

.letter {
  display: inline-block;
  font-weight: 900;
  font-stretch: 125%;
  animation: wave-wide 12s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.15s);
}

.title-line--normal .letter {
  font-stretch: 100%;
  animation-name: wave-normal;
}

@keyframes wave-wide {
  0%, 100% {
    font-weight: 900;
  }
  50% {
    font-weight: 500;
  }
}

@keyframes wave-normal {
  0%, 100% {
    font-weight: 900;
  }
  50% {
    font-weight: 750;
  }
}

.title--static {
  font-weight: 900;
  font-stretch: 125%;
}

.calculator-section {
  border-top: 3px solid var(--color-border);
  padding-top: var(--space-xl);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
