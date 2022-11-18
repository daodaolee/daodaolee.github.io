<script setup lang="ts">
import { useData } from 'vitepress'
import { formatDate } from '../tools'
const { theme } = useData()
const { posts } = theme.value

const target = posts
  .filter((item: any) => item.frontMatter.title)
  .map((item: any) => {
    return {
      title: item.frontMatter.title,
      date: item.frontMatter.date,
      link: item.regularPath
    }
  })

const postData: any = []

target.reduce((item: any, curr: any, index: number) => {
  if (!index) 
    curr.yearFlag = curr.date.split('-')[0]
  else if (item.date.split('-')[0] !== curr.date.split('-')[0]) 
    curr.yearFlag = curr.date.split('-')[0]
  postData.push(curr)
  return curr
}, {})
</script>

<template>
  <div class="post pt-25 max-w-73ch mx-auto px-6 md:px-0 pb-15">
    <ul>
      <a
        v-for="(post, index) in postData" :key="index"
        :href="post.link" 
        class="item block font-normal mb-6 mt-2 no-underline"
      >
        <div v-if="post.yearFlag" relative h20 pointer-events-none>
          <span text-8em op10 absolute left--3rem top--2rem font-bold>{{ post.yearFlag }}</span>
        </div>
        <li class="no-underline op-65  hover:op-100  transition-colors-300">
          <div class="title text-lg leading-1.26rem">
            <span class="align-middle text-1.23rem">{{ post.title }}</span>
          </div>
          <div class="time opacity-50 text-sm pt-0.5rem">{{ formatDate(post.date) }}</div>
        </li>
      </a>
    </ul>
  </div>
</template>