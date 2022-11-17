<script setup lang="ts">
// import { computed, defineAsyncComponent } from 'vue'
import { useData } from 'vitepress'
import { utcToString } from '../tools'

const { page } = useData()
const { frontmatter } = page.value
const { date, tags } = frontmatter
</script>

<template>
  <main class="content max-w-73ch mx-auto px-6 md:px-0 pb-15">
    <div class="pt-25">
      <div class="pb-5">
        <h1 class="title mt-0 text-2.2rem mb-5">
          {{ frontmatter.title }}
        </h1>
        <div class="op-60 flex items-end">
          <span>{{ date && utcToString(date) }}</span>
          <div class="text-0.85rem pl-1.8rem">
            <span v-for="(tag, index) in tags" :key="index">
              #{{ tag }}&nbsp;
            </span>
          </div>
        </div>
      </div>
      <Content class="page" />
    </div>
  </main>
</template>

<style scoped>
</style>
