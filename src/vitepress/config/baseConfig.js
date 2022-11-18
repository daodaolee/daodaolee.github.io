const Unocss = require('unocss/vite').default
const presetIcons = require('@unocss/preset-icons').default
const { presetAttributify, presetUno } = require('unocss')
const deps = ['@vueuse/core']

module.exports = async () => ({
  vite: {
    ssr: {
      noExternal: deps,
    },
    optimizeDeps: {
      exclude: deps,
    },
    plugins: [
      Unocss({
        presets: [presetAttributify(), presetUno(), presetIcons()]
      }),
    ],
  },

  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.svg',
      },
    ]
  ]
})
