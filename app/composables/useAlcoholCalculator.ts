import type { VolumeUnit } from '~/types'

/**
 * Convert volume to milliliters based on unit
 */
export function toMilliliters(value: number, unit: VolumeUnit): number {
  switch (unit) {
    case 'l':
      return value * 1000
    case 'cl':
      return value * 10
    case 'ml':
    default:
      return value
  }
}

/**
 * Calculate pure alcohol content in milliliters
 */
export function calculatePureAlcohol(volumeMl: number, alcoholPercent: number): number {
  return volumeMl * (alcoholPercent / 100)
}

/**
 * Calculate price per centiliter of pure alcohol
 */
export function calculatePricePerClAlcohol(price: number, pureAlcoholMl: number): number {
  if (pureAlcoholMl <= 0) return 0
  return price / (pureAlcoholMl / 10)
}

export function useAlcoholCalculator() {
  const calculate = (
    price: number,
    volume: number,
    volumeUnit: VolumeUnit,
    alcoholPercent: number
  ) => {
    const volumeMl = toMilliliters(volume, volumeUnit)
    const pureAlcoholMl = calculatePureAlcohol(volumeMl, alcoholPercent)
    const pricePerClAlcohol = calculatePricePerClAlcohol(price, pureAlcoholMl)

    return {
      volumeMl,
      pureAlcoholMl,
      pricePerClAlcohol
    }
  }

  return {
    calculate,
    toMilliliters,
    calculatePureAlcohol,
    calculatePricePerClAlcohol
  }
}
