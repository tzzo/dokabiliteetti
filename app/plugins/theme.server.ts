export default defineNuxtPlugin(() => {
  const cookie = useCookie<string>('dokabiliteetti-theme')
  const theme = cookie.value

  // Apply explicit theme choice from cookie during SSR
  if (theme === 'dark' || theme === 'light') {
    useHead({
      htmlAttrs: {
        'data-theme': theme
      }
    })
  }
  // For 'system' or no cookie, the inline script in nuxt.config handles it
})
