<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useData } from 'vitepress'
import Navbar from './Navbar.vue'
// import { getSideBarConfig, isSideBarEmpty } from '../support/sideBar'

// components
import Page from './Page.vue'

// const route = useRoute()
const { frontmatter } = useData()

// Home
const Home = defineAsyncComponent(() => import('./Home.vue'))

// custom layout
const isCustomLayout = computed(() => !!frontmatter.value.customLayout)
// home
const enableHome = computed(() => !!frontmatter.value.home)

// sidebar
// const openSideBar = ref(false)

// const showSidebar = computed(() => {
//   if (frontmatter.value.home || frontmatter.value.sidebar === false)
//     return false

//   return true
//   // todo
//   // return !isSideBarEmpty(
//   //   getSideBarConfig(theme.value.sidebar, route.data.relativePath),
//   // )
// })

// const toggleSidebar = (to?: boolean) => {
//   openSideBar.value = typeof to === 'boolean' ? to : !openSideBar.value
// }
// const hideSidebar = toggleSidebar.bind(null, false)
// // close the sidebar when navigating to a different location
// watch(route, hideSidebar)
</script>

<template>
  <div class="theme">
    <Navbar v-if="!enableHome" />
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

