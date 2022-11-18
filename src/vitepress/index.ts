import './styles/index.less'
import type { Theme } from 'vitepress'
import VPApp from './components/App.vue'
import NotFound from './components/NotFound.vue'
import { withConfigProvider } from './composables/config'

const VPTheme: Theme = {
  Layout: withConfigProvider(VPApp),
  // Layout: VPApp,
  NotFound
}

export { VPTheme }