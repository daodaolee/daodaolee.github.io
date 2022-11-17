<script setup lang="ts">
import { useData } from 'vitepress'
// const { readFileSync } = require('fs')
// import { getFile } from '../tools'
// const route = useRoute()
// const { component } = route
const { theme } = useData()
const { posts } = theme.value
console.log(posts)
</script>

<template>
  <div class="post pt-25 max-w-73ch mx-auto px-6 md:px-0 pb-15">
    <ul>
      <template v-for="(post) in posts" :key="post.text">
        <div relative h20 pointer-events-none>
          <span text-8em op10 absolute left--3rem top--2rem font-bold>{{ post.year }}</span>
        </div>
        <!-- <a :href="withBase(article)"></a> -->
        <a
          v-for="(item, index) in post.post" :key="index"
          :href="`${item.link}.html`" 
          class="item block font-normal mb-6 mt-2 no-underline op-65 hover:op-100 transition-colors-300"
        >
          <li class="no-underline">
            <div class="title text-lg leading-1.26rem">
              <span class="align-middle text-1.23rem">{{ item.text }}</span>
            </div>
            <div class="time opacity-50 text-sm pt-0.5rem">{{ item.date }}</div>
          </li>
        </a>
      </template>
    </ul>
  </div>
</template>