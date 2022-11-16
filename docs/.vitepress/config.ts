import type { UserConfig } from 'vitepress'
import baseConfig from 'vitepress-theme-minimalist/config'
const config: UserConfig = {
  extends: baseConfig,
  title: 'Minimalist',
  markdown: {
    theme: {
      dark: 'vitesse-dark',
      light: 'vitesse-light'
    }
  },
  // base: '/vitepress-theme-minimalist',
  base: '/',
  themeConfig: {
    lastestPage: [{
      text: 'git',
      link: '/page/git',
      date: '2021-10-24'
    }, {
      text: 'async',
      link: '/page/async',
      date: '2021-02-01'
    }, {
      text: 'chrome_workflow',
      link: '/page/chrome_workflow',
      date: '2021-02-01'
    }]
  }
}
export default config
