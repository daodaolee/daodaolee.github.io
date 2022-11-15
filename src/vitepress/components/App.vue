<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
// import { getSideBarConfig, isSideBarEmpty } from '../support/sideBar'

// components
import Page from './Page.vue'

const route = useRoute()
const { theme, site, frontmatter } = useData()

// Home
const Home = defineAsyncComponent(() => import('./Home.vue'))

// custom layout
const isCustomLayout = computed(() => !!frontmatter.value.customLayout)
// home
const enableHome = computed(() => !!frontmatter.value.home)

// navbar
const showNavbar = computed(() => {
  const themeConfig = theme.value
  if (frontmatter.value.navbar === false || themeConfig.navbar === false)
    return false

  return (
    site.value.title || themeConfig.logo || themeConfig.repo || themeConfig.nav
  )
})

// sidebar
const openSideBar = ref(false)

const showSidebar = computed(() => {
  if (frontmatter.value.home || frontmatter.value.sidebar === false)
    return false

  return true
  // todo
  // return !isSideBarEmpty(
  //   getSideBarConfig(theme.value.sidebar, route.data.relativePath),
  // )
})

const toggleSidebar = (to?: boolean) => {
  openSideBar.value = typeof to === 'boolean' ? to : !openSideBar.value
}
const hideSidebar = toggleSidebar.bind(null, false)
// close the sidebar when navigating to a different location
watch(route, hideSidebar)

const pageClass = computed(() => {
  return [{
    'no-navbar': !showNavbar.value,
    'sidebar-open': openSideBar.value,
    'no-sidebar': !showSidebar.value,
  }]
})
</script>

<template>
  <div class="theme" :class="pageClass">
    <!-- <NavBar /> -->
    <Content v-if="isCustomLayout" />
    <template v-else-if="enableHome">
      <slot name="home">
        <Home />
      </slot>
    </template>
    <Page v-else>
      <template #top>
        <slot name="page-top" />
      </template>
      <template #bottom>
        <slot name="page-bottom" />
      </template>
    </Page>
  </div>
</template>

