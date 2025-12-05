import { ref, computed, watch } from 'vue'
import type { Drink, VolumeOption } from '~/types'

const STORAGE_KEY = 'dokabiliteetti-drinks'

// Global state shared across components
const drinks = ref<Drink[]>([])
const isListOpen = ref(false)
const isInitialized = ref(false)

function generateId(): string {
  return crypto.randomUUID()
}

function loadFromStorage(): Drink[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Convert date strings back to Date objects
      return parsed.map((d: Drink) => ({
        ...d,
        createdAt: new Date(d.createdAt)
      }))
    }
  } catch (e) {
    console.error('Failed to load drinks from storage:', e)
  }
  return []
}

function saveToStorage(drinksData: Drink[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drinksData))
  } catch (e) {
    console.error('Failed to save drinks to storage:', e)
  }
}

export function useDrinks() {
  // Initialize from storage on first use (client-side only)
  if (!isInitialized.value && typeof window !== 'undefined') {
    drinks.value = loadFromStorage()
    isInitialized.value = true
  }

  // Sort drinks by best value (lowest price per cl)
  const sortedDrinks = computed(() => {
    return [...drinks.value].sort((a, b) => a.pricePerClAlcohol - b.pricePerClAlcohol)
  })

  const drinkCount = computed(() => drinks.value.length)

  const bestDrink = computed(() => {
    if (sortedDrinks.value.length === 0) return null
    return sortedDrinks.value[0]
  })

  function addDrink(
    name: string,
    price: number,
    volume: VolumeOption,
    alcoholPercent: number,
    pureAlcoholMl: number,
    pricePerClAlcohol: number
  ): Drink {
    const drink: Drink = {
      id: generateId(),
      name: name || `${volume.label} ${alcoholPercent}%`,
      price,
      volume: volume.value * (volume.unit === 'l' ? 1000 : volume.unit === 'cl' ? 10 : 1),
      volumeUnit: volume.unit,
      alcoholPercent,
      pureAlcoholMl,
      pricePerClAlcohol,
      createdAt: new Date()
    }

    drinks.value.push(drink)
    saveToStorage(drinks.value)

    // Auto-open list when adding first drink
    if (drinks.value.length === 1) {
      isListOpen.value = true
    }

    return drink
  }

  function removeDrink(id: string): void {
    const idx = drinks.value.findIndex(d => d.id === id)
    if (idx !== -1) {
      drinks.value.splice(idx, 1)
      saveToStorage(drinks.value)
    }
  }

  function clearAllDrinks(): void {
    drinks.value = []
    saveToStorage(drinks.value)
    isListOpen.value = false
  }

  function toggleList(): void {
    isListOpen.value = !isListOpen.value
  }

  function isBestValue(drink: Drink): boolean {
    return bestDrink.value?.id === drink.id
  }

  // Watch for changes and persist
  watch(drinks, (newDrinks) => {
    saveToStorage(newDrinks)
  }, { deep: true })

  return {
    drinks: sortedDrinks,
    drinkCount,
    bestDrink,
    isListOpen,
    addDrink,
    removeDrink,
    clearAllDrinks,
    toggleList,
    isBestValue
  }
}
