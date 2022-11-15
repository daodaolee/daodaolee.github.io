declare const __ALGOLIA__: boolean

declare module '*.vue' {
  import type { ComponentOptions } from 'vue'
  const comp: ComponentOptions
  export default comp
}

declare module 'vitepress-theme-minimalist/config' {
  export default any
}

declare module '@docsearch/js' {
  function docsearch<T = any>(props: T): void
  export default docsearch
}
declare module '@docsearch/css' {
  const css: String
  export default css
}