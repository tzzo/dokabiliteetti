export type VolumeUnit = 'ml' | 'cl' | 'l'

export interface Drink {
  id: string
  name: string
  price: number
  volume: number
  volumeUnit: VolumeUnit
  alcoholPercent: number
  pureAlcoholMl: number
  pricePerClAlcohol: number
  mlPerEuro: number
  dokabilityScore: number
  createdAt: Date
}

export type Theme = 'light' | 'dark' | 'system'

export type Locale = 'fi' | 'en'

export interface VolumeOption {
  value: number
  unit: VolumeUnit
  label: string
}

export const VOLUME_OPTIONS: VolumeOption[] = [
  { value: 4, unit: 'cl', label: '4cl' },
  { value: 8, unit: 'cl', label: '8cl' },
  { value: 12, unit: 'cl', label: '12cl' },
  { value: 16, unit: 'cl', label: '16cl' },
  { value: 24, unit: 'cl', label: '24cl' },
  { value: 33, unit: 'cl', label: '33cl' },
  { value: 40, unit: 'cl', label: '40cl' },
  { value: 44, unit: 'cl', label: '44cl' },
  { value: 50, unit: 'cl', label: '50cl' },
  { value: 70, unit: 'cl', label: '70cl' },
  { value: 75, unit: 'cl', label: '75cl' },
  { value: 1, unit: 'l', label: '1L' },
  { value: 1.5, unit: 'l', label: '1.5L' }
]

export function getDefaultAlcoholPercent(volume: VolumeOption): number {
  const label = volume.label
  // Spirits: 4cl, 8cl, 70cl, 1L
  if (['4cl', '8cl', '70cl', '1L'].includes(label)) return 40
  // Wine: 12cl, 16cl, 24cl, 75cl, 1.5L
  if (['12cl', '16cl', '24cl', '75cl', '1.5L'].includes(label)) return 12
  // Beer: 33cl, 40cl, 44cl, 50cl
  return 5
}
