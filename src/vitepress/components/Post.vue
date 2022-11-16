<script setup lang="ts">
import { useData } from 'vitepress'
const { theme } = useData()
const { posts } = theme.value
</script>

<template>
  <div class="posts pt-25">
    <ul>
      <template v-for="(post) in posts" :key="post.text">
        <div relative h20 pointer-events-none>
          <span text-8em op5 absolute left--3rem top--2rem font-bold>{{ post.year }}</span>
        </div>

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