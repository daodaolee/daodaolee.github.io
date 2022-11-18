<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useData, useRoute } from 'vitepress'
const route = useRoute()

const { frontmatter } = useData()

const Home = defineAsyncComponent(() => import('./Home.vue'))
const Navbar = defineAsyncComponent(() => import('./Navbar.vue'))
const Page = defineAsyncComponent(() => import('./Page.vue'))
const Post = defineAsyncComponent(() => import('./Post.vue'))
const Movie = defineAsyncComponent(() => import('./Movie.vue'))

const enableHome = computed(() => !!frontmatter.value.home)
const enablePost = computed(() => !!(route.path === '/posts/'))
const enableMovie = computed(() => !!(route.path === '/movies/'))
</script>

<template>
  <div class="theme">
    <Home v-if="enableHome" />
    <div v-else>
      <Navbar />
      <Post v-if="enablePost" class="px-6 md:px-0" />
      <Movie v-else-if="enableMovie" class="px-6 md:px-0" />
      <Page v-else />
    </div>
  </div>
  <div class="text-center text-0.1rem pt-10 pb-2 op-20 scale-80" style="letter-spacing: 0.2rem;">
    <a href="https://beian.miit.gov.cn/">浙ICP备2022027583号-1</a>
  </div>
</template>

