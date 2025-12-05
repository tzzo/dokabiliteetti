import { ref, computed, watch } from 'vue'
import type { Theme } from '~/types'

const COOKIE_NAME = 'dokabiliteetti-theme'

// Global state
const theme = ref<Theme>('system')
const isInitialized = ref(false)

function getSystemTheme(): 'light' | 'dark' {
  if (import.meta.server) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(value: Theme): void {
  if (import.meta.server) return

  const effectiveTheme = value === 'system' ? getSystemTheme() : value
  document.documentElement.setAttribute('data-theme', effectiveTheme)

  // Update meta theme-color
  const metaTheme = document.querySelector('meta[name="theme-color"]')
  if (metaTheme) {
    metaTheme.setAttribute('content', effectiveTheme === 'dark' ? '#0A0A0A' : '#2563EB')
  }
}

export function useTheme() {
  const cookie = useCookie<Theme>(COOKIE_NAME, {
    default: () => 'system',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  })

  // Computed for the effective (resolved) theme
  const effectiveTheme = computed<'light' | 'dark'>(() => {
    if (theme.value === 'system') {
      return getSystemTheme()
    }
    return theme.value
  })

  const isDark = computed(() => effectiveTheme.value === 'dark')

  function setTheme(value: Theme): void {
    theme.value = value
    cookie.value = value
    applyTheme(value)
  }

  function toggleTheme(): void {
    const newTheme = effectiveTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // Initialize on mount
  function initialize(): void {
    if (isInitialized.value) return
    if (import.meta.server) return

    // Load from cookie
    theme.value = cookie.value || 'system'
    applyTheme(theme.value)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme('system')
      }
    })

    isInitialized.value = true
  }

  // Watch for theme changes
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    theme,
    effectiveTheme,
    isDark,
    setTheme,
    toggleTheme,
    initialize
  }
}
