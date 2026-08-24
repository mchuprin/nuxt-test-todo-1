// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  ssr: false,

  app: {
    baseURL: import.meta.env.NUXT_APP_BASE_URL || '/',
  },

  router: {
    options: {
      hashMode: true,
    },
  },

  css: ['~/styles/styles.scss'],

  modules: ['@pinia/nuxt'],

  alias: {
    '#components': '<rootDir>/app/components',
    '#composables': '<rootDir>/app/composables',
    '#stores': '<rootDir>/app/stores',
    '#types': '<rootDir>/app/types',
    '#utils': '<rootDir>/app/utils',
    '#styles': '<rootDir>/app/styles',
  },
})
