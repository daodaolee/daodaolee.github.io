import './styles/index.less'
import type { Theme } from 'vitepress'
import VPApp from './components/App.vue'
import NotFound from './components/NotFound.vue'
import { withConfigProvider } from './composables/config'

export type { MinimalistTheme } from './types/config'

// export const VPTheme: Theme = {
//   // Layout: withConfigProvider(VPApp),
//   Layout: VPApp,
//   NotFound,
// }

const VPTheme: Theme = {
  Layout: withConfigProvider(VPApp),
  NotFound
}

export { VPTheme }

export type { Config } from './config'
