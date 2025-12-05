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

/**
 * Calculate milliliters of pure alcohol per euro spent
 */
export function calculateMlPerEuro(pureAlcoholMl: number, price: number): number {
  if (price <= 0) return 0
  return pureAlcoholMl / price
}

/**
 * Calculate dokabiliteetti score (1-100)
 * Based on ml of pure alcohol per euro, multiplied by 6.5
 */
export function calculateDokabilityScore(mlPerEuro: number): number {
  return Math.min(100, Math.round(mlPerEuro * 6.5))
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
    const mlPerEuro = calculateMlPerEuro(pureAlcoholMl, price)
    const dokabilityScore = calculateDokabilityScore(mlPerEuro)

    return {
      volumeMl,
      pureAlcoholMl,
      pricePerClAlcohol,
      mlPerEuro,
      dokabilityScore
    }
  }

  return {
    calculate,
    toMilliliters,
    calculatePureAlcohol,
    calculatePricePerClAlcohol,
    calculateMlPerEuro,
    calculateDokabilityScore
  }
}
