import type { Component } from 'vue'
import {
  computed,
  defineComponent,
  h,
  inject,
  provide,
} from 'vue'
import { useData } from 'vitepress'

const configSymbol = Symbol('config')

/**
 * Wrap root App component to provide the resolved theme config
 * so that we reuse the same computed ref across the entire app instead of
 * re-creating one in every consumer component.
 */
export function withConfigProvider(App: Component) {
  return defineComponent({
    name: 'VPConfigProvider',
    setup(_, { slots }) {
      const { theme } = useData()
      const config = computed(() => resolveConfig(theme.value))
      provide(configSymbol, config)
      return () => h(App, null, slots)
    },
  })
}

export function useConfig() {
  return {
    config: inject(configSymbol)!,
  }
}

function resolveConfig(config: any) {
  return Object.assign(
    {
      appearance: false,
    },
    config
  )
}