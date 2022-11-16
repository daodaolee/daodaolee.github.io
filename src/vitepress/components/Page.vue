<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import Post from './Post.vue'
const route = useRoute()

const isPosts = computed(() => {
  return Boolean(route.path === '/posts/')
})
</script>

<template>
  <Post v-if="isPosts" class="content max-w-prose mx-auto px-6 md:px-0" />
  <main class="page pt-25 pb-15">
    <Content class="content max-w-prose mx-auto px-6 md:px-0" />
  </main>
</template>

<style scoped>
</style>
