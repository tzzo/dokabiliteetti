export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  ssr: true,

  modules: ['@nuxtjs/i18n', '@vite-pwa/nuxt'],

  i18n: {
    locales: [
      { code: 'fi', language: 'fi-FI', file: 'fi.json', name: 'Suomi' },
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' }
    ],
    defaultLocale: 'fi',
    lazy: true,
    langDir: '../i18n/locales',
    strategy: 'no_prefix',
    vueI18n: '../i18n/i18n.config.ts'
  },

  pwa: {
    registerType: 'autoUpdate',
    devOptions: {
      enabled: false
    },
    manifest: {
      name: 'Dokabiliteetti',
      short_name: 'Dokabiliteetti',
      description: 'Laske juoman hinta-alkoholisuhde',
      theme_color: '#2563EB',
      background_color: '#FAFAFA',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    }
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Dokabiliteetti',
      meta: [
        { name: 'description', content: 'Laske juoman hinta-alkoholisuhde' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#2563EB' }
      ],
      script: [
        {
          innerHTML: `(function(){try{var c=document.cookie.match(/dokabiliteetti-theme=([^;]+)/);var t=c?c[1]:null;var isDark=t==='dark'||(t==='system'||!t)&&window.matchMedia('(prefers-color-scheme:dark)').matches;if(isDark){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`,
          type: 'text/javascript',
          tagPosition: 'head'
        }
      ],
      style: [
        {
          innerHTML: `html,body{background:#FAFAFA;color:#1A1A1A}body{visibility:hidden}@media(prefers-color-scheme:dark){html,body{background:#0A0A0A;color:#FAFAFA}}html[data-theme=dark],html[data-theme=dark] body{background:#0A0A0A!important;color:#FAFAFA!important}html[data-theme=light],html[data-theme=light] body{background:#FAFAFA!important;color:#1A1A1A!important}`,
          type: 'text/css'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Archivo:wdth,wght@62..125,100..900&display=swap' }
      ]
    }
  }
})
