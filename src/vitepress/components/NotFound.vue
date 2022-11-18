<script setup lang="ts">
import { useData } from 'vitepress'

const { site } = useData()
const msgs = [
  '你！在！干！什！么！',
  'This is the altar, go back?',
  'It seems that your choice is wrong',
  '看起来...不太妙...',
]
function getMsg() {
  return msgs[Math.floor(Math.random() * msgs.length)]
}
</script>

<template>
  <div>
    <h1>
      404
    </h1>
    <blockquote>{{ getMsg() }}</blockquote>
    <a :href="site.base" aria-label="back to home" class="op-60"> cd&emsp;. . 
    </a>
  </div>
</template>

<style scoped>
h1{
  font-size:5rem
}
</style>
