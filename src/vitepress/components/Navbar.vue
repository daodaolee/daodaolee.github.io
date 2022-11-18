<script lang="ts" setup>
import { useData } from 'vitepress'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const { theme } = useData()
const { logo, logoDark } = theme.value

const website = [{
  name: 'Posts',
  icon: 'i-ri-article-line',
  href: '/posts/',
  target: '_self',
  // 大屏展示文字
  xlShowText: true
}, {
  name: 'Movies',
  href: '/movies/',
  target: '_self',
  // 小屏完全消失
  hidden: true,
  xlShowText: true
}, {
  icon: 'i-ri:github-line',
  href: 'https://github.com/daodaolee',
  hidden: true
}, {
  icon: 'i-ri:twitter-line',
  class: 'hover:bg-[#00ACEE]',
  href: 'https://twitter.com/daodaolee_',
  hidden: true
}, {
  icon: 'i-ri-instagram-line',
  class: 'decoration-none hover:bg-gradient-to-r from-[#fd5949] to-[#d6249f]',
  hidden: true,
  href: 'https://www.instagram.com/daodaoleee/',
}, {
  icon: 'i-ri-dribbble-line',
  class: 'hover:bg-[#ea4c89] dark:hover:bg-[#ea4c89]',
  hidden: true,
  href: 'https://dribbble.com/daodaolee'
}, {
  icon: 'i-ri-bilibili-fill',
  class: 'hover:bg-[#fb7299]',
  hidden: true,
  href: 'https://space.bilibili.com/294106298?spm_id_from=333.1007.0.0'
}]
</script>

<template>
  <header class="w-100vw p-6 flex items-center justify-between fixed">
    <a href="/">
      <img :src="isDark ? logoDark : logo" class="w-10 h-10">
    </a>
    
    <div class="nav-icons flex items-center gap-5">
      <a
        v-for="(site, index) in website" :key="index"
        :target="site.target || '_blank'"
        :href="site.href"
        class="cursor-pointer op-60 transition-colors-300"
        :class="[site.hidden ? 'lt-md:hidden' : '']"
      >
        <div v-if="site.icon" text-xl :class="site.xlShowText ? 'md:hidden' : ''">
          <div class="icon" :class="[site.icon]" />
        </div>
        <span v-if="site.name" text-sm ml-1 class="lt-md:hidden">{{ site.name }}</span>
      </a>
      <a
        class="cursor-pointer  op-60"
        @click="toggleDark()"
      >
        <div class="icon" :class="[isDark ? 'i-ri-moon-line' : 'i-ri:sun-line']" />
      </a>
    </div>
  </header>
</template>

<style scoped lang="less">
header{
  background-color: var(--c-bg);
  z-index: 10;
}
.nav-icons{
  a{
    &:hover{
      opacity: 1;
    }
  }
  span{
    font-family: var(--font-family-base);
    font-size: 1.1rem;
    font-weight: 400;
  }
  .icon{
    width: 1.3rem;
    height:1.3rem;
  }
}
</style>
