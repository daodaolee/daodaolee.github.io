<script setup lang="ts">
import { useData } from 'vitepress'

import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
const toggleDark = useToggle(isDark)

const { theme } = useData()
const { posts } = theme.value

const allPosts = posts
  .filter((item: any) => item.frontMatter.title)
  .map((item: any) => {
    return {
      title: item.frontMatter.title,
      date: item.frontMatter.date,
      link: item.regularPath
    }
  })

const bios = [
  'Front-end developer / Fover of minimalism.',
  'Currently working at Hangzhou.',
  'I like to do some fun projects.'
]
const baseIconClass = 'inline-flex px-3 py-2 mt-2 mr-2 rounded-md bg-gray-50 transition-colors  hover:text-white dark:bg-gray-50/10 '
const website = [{
  icon: 'i-ri-book-2-line',
  name: 'Post',
  href: '/posts/',
  target: '_self',
  class: 'hover:bg-gray-700 dark:hover:bg-white dark:hover:text-gray-900'
}, {
  icon: 'i-ri:github-line',
  href: 'https://github.com/daodaolee',
  class: 'hover:bg-gray-700 dark:hover:bg-white dark:hover:text-gray-900'
}, {
  icon: 'i-ri:twitter-line',
  class: 'hover:bg-[#00ACEE]',
  href: 'https://twitter.com/daodaolee_'
}, {
  icon: 'i-ri-instagram-line',
  class: 'decoration-none hover:bg-gradient-to-r from-[#fd5949] to-[#d6249f]',
  href: 'https://www.instagram.com/daodaoleee/'
}, {
  icon: 'i-ri-dribbble-line',
  class: 'hover:bg-[#ea4c89] dark:hover:bg-[#ea4c89]',
  href: 'https://dribbble.com/daodaolee'
}, {
  icon: 'i-ri-bilibili-fill',
  class: 'hover:bg-[#fb7299] hover:text-white dark:bg-gray-50/10',
  href: 'https://space.bilibili.com/294106298?spm_id_from=333.1007.0.0'
}]

const projects = [{
  name: 'Weekly Tracker',
  descr: 'Translate some front-end periodicals',
  icon: 'i-twemoji-newspaper',
  href: 'https://github.com/daodaolee/typora-scrolls'
}, {
  name: 'Typora Scrolls',
  descr: 'A typora theme in sheepskin style',
  icon: 'i-twemoji-full-moon',
  href: 'https://github.com/daodaolee/typora-scrolls'
}, {
  name: 'Juejin Scrolls',
  descr: 'Juejin community markdown theme',
  icon: 'i-twemoji-coin',
  href: 'https://github.com/daodaolee/juejin-markdown-theme-scrolls'
}, {
  name: 'Vuepress Musicplayer',
  descr: 'A vuepress immersive music plugin',
  icon: 'i-twemoji-musical-notes',
  href: 'https://github.com/daodaolee/vuepress-plugin-awesome-musicplayer'
}, {
  name: 'Netease Cloud',
  descr: 'Mac version of NetEase Cloud tool',
  icon: 'i-twemoji-cloud',
  href: 'https://github.com/daodaolee/netease-cloud'
}, {
  name: 'China Color',
  descr: 'Traditional color aesthetics of chinese',
  icon: 'i-twemoji-rainbow',
  href: 'https://github.com/daodaolee/china-color'
}, {
  name: 'Portal Widgets',
  descr: 'Minimalist google extension tab',
  icon: 'i-twemoji-bread',
  href: 'https://github.com/daodaolee/portal-widgets-extension'
}, {
  name: 'Inspiration Growing',
  descr: 'Don\'t know what\'s next...',
  icon: 'i-twemoji-thinking-face',
  href: 'javascript:void(null)'
}]
</script>

<template>
  <div class="home px-6 py-[8vh] max-w-[76ch] mx-auto xl:text-lg">
    <header class="outfit mt-12 md:mt-18">
      <h1 class="text-5xl">
        <span class="block">Hello,</span>
        <span class="block mt-2">I'm Dao.</span>
      </h1>
      <div class="mt-6">
        <div
          v-for="(bio, index) in bios"
          :key="index"
          :class="!index ? '' : 'mt-2'"
        >
          <span>{{ bio }}</span>
        </div>
      </div>
      <div mt-4>
        <a
          v-for="(site, index) in website" :key="index"
          :target="site.target || '_blank'"
          :href="site.href"
          :class="baseIconClass + site.class || ''"
        >
          <div text-xl>
            <div :class="site.icon" />
          </div>
          <div v-if="site.name" text-sm ml-1>{{ site.name }}</div>
        </a>
        <a
          target="_blank"
          class="inline-flex cursor-pointer px-3 py-2 mt-2 mr-2 rounded-md bg-gray-50 transition-colors hover:bg-gray-700 dark:hover:bg-white dark:hover:text-gray-900 hover:text-white dark:bg-gray-50/10"
          @click="toggleDark()"
        >
          <div text-xl>
            <div :class="[isDark ? 'i-ri-moon-line' : 'i-ri:sun-line']" />
          </div>
        </a>
      </div>
    </header>
    <h2 class="flex items-center mt-14 mb-4 font-semibold text-3xl">
      <span flex-1 class="outfit">Projects</span>
      <div class="op-50 ml-2 hover:op-100 transition-opacity cursor-pointer">
        <div class="m-2 i-ri-arrow-right-up-line" />
      </div>
    </h2>
    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <a
        v-for="(project, index) in projects"
        :key="index" 
        :href="project.href"
        class="px-4 py-3 rounded-md bg-gray-100 transition-colors decoration-none hover:bg-gray-200 dark:bg-gray-50/10 dark:hover:bg-gray-50/20"
      >
        <div class="flex h-full items-center justify-center">
          <div flex-1>
            <div font-medium leading-relaxed>{{ project.name }}</div>
            <div op-50 font-normal text-sm>{{ project.descr }}</div>
          </div>
          <div ml-4 text-4xl op-80>
            <div :class="project.icon" />
          </div>

        </div>
      </a>
    </div>
    <h2 class="flex items-center mt-14 mb-4 font-semibold text-3xl">
      <span flex-1 class="outfit">Latest Posts</span>
      <div class="op-50 ml-2 hover:op-100 transition-opacity cursor-pointer">
        <div class="m-2 i-ri-arrow-right-up-line" />
      </div>
    </h2>
    <div class="grid grid-cols-1 -mx-2">
      <a
        v-for="(page, index) in allPosts.slice(0, 5)"
        :key="index"
        :href="page.link" 
        class="flex px-3 py-2 mt-2 mr-2 rounded-md transition-colors decoration-none hover:bg-gray-100 dark:hover:bg-gray-50/10"
      >
        <div flex-1>{{ page.title }}</div>
        <div op-40 font-normal class="hidden sm:block">{{ page.date }}</div>
      </a>
    </div>
  </div>
</template>

<style scoped lang="less">
.home {
  .i-twemoji-full-moon {
    background: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 36 36' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Ccircle cx='18' cy='18' r='18' fill='%23FFD983'/%3E%3Cg fill='%23FFCC4D'%3E%3Ccircle cx='10.5' cy='8.5' r='3.5'/%3E%3Ccircle cx='20' cy='17' r='3'/%3E%3Ccircle cx='24.5' cy='28.5' r='3.5'/%3E%3Ccircle cx='22' cy='5' r='2'/%3E%3Ccircle cx='3' cy='18' r='1'/%3E%3Ccircle cx='30' cy='9' r='1'/%3E%3Ccircle cx='15' cy='31' r='1'/%3E%3Ccircle cx='32' cy='19' r='2'/%3E%3Ccircle cx='10' cy='23' r='2'/%3E%3C/g%3E%3C/svg%3E") no-repeat;
    background-size: 100% 100%;
    background-color: transparent;
    width: 1.2em;
    height: 1.2em;
  }
  .i-twemoji-musical-notes {
    background: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 36 36' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='%235DADEC' d='M14.182.168L7.818 1.469A1.07 1.07 0 0 0 7 2.471v15.857A6.226 6.226 0 0 0 5 18c-2.762 0-5 1.741-5 3.889c0 2.147 2.238 3.889 5 3.889c2.713 0 4.908-1.683 4.985-3.777H10V6.477l4.182-.855A1.07 1.07 0 0 0 15 4.62V.835c0-.459-.368-.76-.818-.667zm21 4l-6.363 1.301c-.451.092-.819.543-.819 1.002v15.857A6.198 6.198 0 0 0 26 22c-2.762 0-5 1.741-5 3.889c0 2.147 2.238 3.889 5 3.889c2.713 0 4.908-1.683 4.985-3.777H31V10.477l4.182-.855A1.07 1.07 0 0 0 36 8.62V4.835c0-.459-.368-.76-.818-.667z'/%3E%3Cpath fill='%235DADEC' d='m23.182 10.167l-6.363 1.301c-.451.093-.819.544-.819 1.003v15.857A6.198 6.198 0 0 0 14 28c-2.762 0-5 1.741-5 3.889s2.238 3.889 5 3.889c2.713 0 4.908-1.683 4.985-3.777H19V16.477l4.182-.855A1.07 1.07 0 0 0 24 14.62v-3.785c0-.459-.368-.76-.818-.668z'/%3E%3C/svg%3E") no-repeat;
    background-size: 100% 100%;
    background-color: transparent;
    width: 1.2em;
    height: 1.2em;
  }
  .i-twemoji-cloud {
    background: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 36 36' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='%23CCD6DD' d='M27 8a6.98 6.98 0 0 0-2.015.298c.005-.1.015-.197.015-.298a5.998 5.998 0 0 0-11.785-1.573A5.974 5.974 0 0 0 11 6a6 6 0 1 0 0 12a5.998 5.998 0 0 0 5.785-4.428A5.975 5.975 0 0 0 19 14c.375 0 .74-.039 1.096-.104c-.058.36-.096.727-.096 1.104c0 3.865 3.135 7 7 7s7-3.135 7-7a7 7 0 0 0-7-7z'/%3E%3Cpath fill='%23E1E8ED' d='M31 22c-.467 0-.91.085-1.339.204c.216-.526.339-1.1.339-1.704a4.5 4.5 0 0 0-4.5-4.5a4.459 4.459 0 0 0-2.701.921A6.497 6.497 0 0 0 16.5 12a6.497 6.497 0 0 0-6.131 4.357A8 8 0 1 0 8 32h23c2.762 0 5-2.238 5-5s-2.238-5-5-5z'/%3E%3C/svg%3E") no-repeat;
    background-size: 100% 100%;
    background-color: transparent;
    width: 1.2em;
    height: 1.2em;
  }
  .i-twemoji-rainbow {
    background: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 36 36' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='%238767AC' d='M36 1C16.118 1 1 16.118 1 36h17.042c0-9.917 8.042-17.958 17.958-17.958V1z'/%3E%3Cpath fill='%23EB2027' d='M0 35.999h3.042c0-18.189 14.734-32.935 32.917-32.957V0C16.095.023 0 16.131 0 35.999z'/%3E%3Cpath fill='%23F19020' d='M3.083 36h3C6.083 19.468 19.473 6.065 36 6.043v-3C17.817 3.065 3.083 17.811 3.083 36z'/%3E%3Cpath fill='%23FFCB4C' d='M6.083 36h3C9.083 21.125 21.13 9.065 36 9.043v-3C19.473 6.065 6.083 19.468 6.083 36z'/%3E%3Cpath fill='%235C903F' d='M9.083 36h3c0-13.217 10.705-23.935 23.917-23.957v-3C21.13 9.065 9.083 21.125 9.083 36z'/%3E%3Cpath fill='%23226798' d='M12.083 36h3c0-11.56 9.362-20.934 20.917-20.956v-3.001C22.788 12.065 12.083 22.783 12.083 36z'/%3E%3C/svg%3E") no-repeat;
    background-size: 100% 100%;
    background-color: transparent;
    width: 1.2em;
    height: 1.2em;
  }
  .i-twemoji-bread {
    background: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 36 36' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='%23D99E82' d='M36 13.5c0-4.558-4.435-8.267-10-8.479V5H10v.021C4.435 5.233 0 8.942 0 13.5c0 1.861.747 3.576 2 4.976V31a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4V18.476c1.253-1.4 2-3.115 2-4.976z'/%3E%3Cpath fill='%23CC927A' d='M19 18.476h15v1.5H19z'/%3E%3Cpath fill='%23FFE8B6' d='M21 13.5c0-3.461-3.538-6.291-8-6.489C12.835 7.004 10.668 7 10.5 7C5.806 7 2 9.91 2 13.5c0 1.595.754 3.053 2 4.184V30a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3V17.679c1.244-1.131 2-2.586 2-4.179z'/%3E%3C/svg%3E") no-repeat;
    background-size: 100% 100%;
    background-color: transparent;
    width: 1.2em;
    height: 1.2em;
  }
  .i-twemoji-coin {
    background: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 36 36' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Ccircle cx='18' cy='19' r='17' fill='%23F4900C'/%3E%3Ccircle cx='18' cy='17' r='17' fill='%23FFCC4D'/%3E%3Ccircle cx='18' cy='18' r='14' fill='%23FFE8B6'/%3E%3Ccircle cx='18' cy='17' r='14' fill='%23FFAC33'/%3E%3Cpath fill='%23FFE8B6' d='M9.543 10.856c0-.545.535-.763.535-.763l7.878-3.7l7.953 3.7s.548.122.548.767v.641H9.543v-.645z'/%3E%3Cpath fill='%23F4900C' d='M25.929 12.836c0-.584-.505-1.057-1.127-1.057H11.129c-.623 0-1.057.473-1.057 1.057c0 .397.204.739.529.92v.666h2.114v-.529h2.114v.529h2.114v-.529h2.114v.529h2.114v-.529h2.114v.529H25.4v-.693c.317-.188.529-.517.529-.893zM27.514 24a.793.793 0 0 1-.793.793H9.279a.793.793 0 1 1 0-1.586h17.443c.437 0 .792.355.792.793z'/%3E%3Cpath fill='%23F4900C' d='M26.457 12.2a.529.529 0 0 1-.529.529H10.071a.53.53 0 0 1 0-1.058l15.857.003a.527.527 0 0 1 .529.526zm-14.271.614h11.629V14H12.186z'/%3E%3Cpath fill='%23FFD983' d='M12.714 20.829c0 .584-.316 1.057-.705 1.057h-.705c-.389 0-.705-.473-.705-1.057v-8.014c0-.584.316-1.057.705-1.057h.705c.389 0 .705.473.705 1.057v8.014zm12.686 0c0 .584-.315 1.057-.705 1.057h-.705c-.389 0-.705-.473-.705-1.057v-8.014c0-.584.315-1.057.705-1.057h.705c.389 0 .705.473.705 1.057v8.014zm-8.457 0c0 .584-.316 1.057-.705 1.057h-.705c-.389 0-.705-.473-.705-1.057v-8.014c0-.584.316-1.057.705-1.057h.705c.389 0 .705.473.705 1.057v8.014zm4.228 0c0 .584-.316 1.057-.705 1.057h-.704c-.389 0-.705-.473-.705-1.057v-8.014c0-.584.316-1.057.705-1.057h.704c.389 0 .705.473.705 1.057v8.014z'/%3E%3Cpath fill='%23FFCC4D' d='M25.929 21.357c0 .584-.473 1.057-1.057 1.057H11.129a1.057 1.057 0 1 1 0-2.114h13.743c.583 0 1.057.473 1.057 1.057z'/%3E%3Cpath fill='%23FFD983' d='M26.986 22.414c0 .584-.473 1.057-1.057 1.057H10.071a1.057 1.057 0 1 1 0-2.114h15.857c.584 0 1.058.473 1.058 1.057z'/%3E%3Cpath fill='%23FFD983' d='M27.514 23.207a.793.793 0 0 1-.793.793H9.279a.793.793 0 1 1 0-1.586h17.443c.437 0 .792.355.792.793z'/%3E%3Cpath fill='%23FFCC4D' d='M25.929 12.286c0-.584-.505-1.057-1.127-1.057H11.129c-.623 0-1.057.473-1.057 1.057c0 .397.204.739.529.92v.666h2.114v-.529h2.114v.529h2.114v-.529h2.114v.529h2.114v-.529h2.114v.529H25.4v-.693c.317-.188.529-.517.529-.893z'/%3E%3Cpath fill='%23FFD983' d='M9.543 11.463c0-.545.535-.763.535-.763L17.956 7l7.953 3.7s.548.122.548.767v.291H9.543v-.295z'/%3E%3Cpath fill='%23FFAC33' d='M18 8.343s-5.455 2.571-5.999 2.803c-.545.231-.363.611.001.611h11.97c.562 0 .429-.429-.017-.661C23.509 10.865 18 8.343 18 8.343z'/%3E%3Cpath fill='%23FFD983' d='M26.457 11.757a.529.529 0 0 1-.529.529H10.071a.53.53 0 0 1 0-1.058l15.857.003a.527.527 0 0 1 .529.526z'/%3E%3C/svg%3E") no-repeat;
    background-size: 100% 100%;
    background-color: transparent;
    width: 1.2em;
    height: 1.2em;
  }
  .i-twemoji-rolled-up-newspaper {
    background: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 36 36' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='%2399AAB5' d='M31.679 4.724c-.082-.087-.159-.176-.244-.261c-2.928-2.929-6.886-3.721-8.838-1.769L1.383 23.908l5.556 5.556l24.74-24.74z'/%3E%3Cpath fill='%2366757F' d='M10.222 25.676c-2.928-2.929-6.886-3.721-8.839-1.768c-1.953 1.953-1.161 5.91 1.768 8.838c2.929 2.93 6.886 3.721 8.839 1.769c1.952-1.953 1.161-5.91-1.768-8.839z'/%3E%3Cpath fill='%23CCD6DD' d='M31.68 4.724c2.722 2.898 3.419 6.682 1.523 8.577L11.99 34.515c1.953-1.953 1.161-5.909-1.768-8.839l-3.889-3.889L27.546.573l4.142 4.142l-.008.009z'/%3E%3Cpath fill='%23E1E8ED' d='M33.094 3.31c2.722 2.898 3.42 6.682 1.523 8.577L13.404 33.1c1.953-1.952 1.162-5.909-1.768-8.838l-2.475-2.475L30.374.573l2.728 2.728l-.008.009z'/%3E%3Cpath fill='%2399AAB5' d='M2.21 25.003c-1.402 1.401-.838 4.371 1.281 6.759c1.916 2.158 4.947 4.008 7.186 2.123c.762-.633 1.163-1.607 1.147-2.735c-.028-1.974-1.298-4.192-3.313-5.79a.755.755 0 0 0-1.054.121a.75.75 0 0 0 .122 1.054c1.647 1.305 2.724 3.126 2.746 4.638c.007.474-.095 1.13-.612 1.566c-1.514 1.273-3.917-.641-5.099-1.971c-1.676-1.888-2.053-3.994-1.343-4.704c.184-.184.412-.231.695-.147c.877.262 2 1.662 2.534 4.205a.75.75 0 1 0 1.468-.308c-.589-2.81-1.958-4.853-3.573-5.335c-.813-.243-1.609-.051-2.185.524zM28.432 4.286a.75.75 0 0 0 .057 1.114c.031.024 3.1 2.539 3.257 5.816a.751.751 0 0 0 1.499-.073c-.19-3.96-3.668-6.794-3.816-6.912a.747.747 0 0 0-.997.055zM26.31 6.407a.752.752 0 0 0 .058 1.115c.031.024 3.1 2.539 3.257 5.816a.75.75 0 0 0 1.499-.073c-.191-3.96-3.668-6.794-3.816-6.912a.747.747 0 0 0-.998.054zm-8.486 8.486c-.018.019-.037.038-.054.059a.75.75 0 0 0 .112 1.055c.031.024 3.1 2.539 3.257 5.816a.75.75 0 0 0 1.499-.073c-.191-3.959-3.668-6.794-3.816-6.912a.747.747 0 0 0-.998.055zm-4.949 4.949a.753.753 0 0 0 .057 1.115c.032.024 3.1 2.539 3.257 5.816a.75.75 0 0 0 1.499-.074c-.191-3.959-3.667-6.793-3.816-6.912a.747.747 0 0 0-.997.055z'/%3E%3Cpath fill='%235DADEC' d='M24.775 19.539c1.296-1.348 3.49-3.383 3.756-3.661c.613-.642-1.541-5.472-3.302-6.854c-.386-.303-.859-.058-1.062.15a347.09 347.09 0 0 1-3.677 3.708c-.231.231-.365.651-.039.952c1.067.984 2.986 3.424 3.528 5.663c.064.261.528.323.796.042z'/%3E%3C/svg%3E") no-repeat;
    background-size: 100% 100%;
    background-color: transparent;
    width: 1.2em;
    height: 1.2em;
  }
  .i-twemoji-newspaper {
    background: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 36 36' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='%2399AAB5' d='M33 36H4c4 0 3-9 3-9c0-2.209 1.791-15 4-15h21s4 0 4 4v17s0 3-3 3z'/%3E%3Cpath fill='%23CCD6DD' d='M30 33c0 3 3 3 3 3H3s-3 0-3-4V4a4 4 0 0 1 4-4h22a4 4 0 0 1 4 4v29z'/%3E%3Cpath fill='%2399AAB5' d='M27 20a1 1 0 0 1-1 1h-8a1 1 0 1 1 0-2h8a1 1 0 0 1 1 1zm0-4a1 1 0 0 1-1 1h-8a1 1 0 1 1 0-2h8a1 1 0 0 1 1 1zm0-4a1 1 0 0 1-1 1h-8a1 1 0 1 1 0-2h8a1 1 0 0 1 1 1zm0 12a1 1 0 0 1-1 1H4a1 1 0 1 1 0-2h22a1 1 0 0 1 1 1zm0 4a1 1 0 0 1-1 1H4a1 1 0 1 1 0-2h22a1 1 0 0 1 1 1zm0 4a1 1 0 0 1-1 1H4a1 1 0 1 1 0-2h22a1 1 0 0 1 1 1zM25 9s2 0 2-2V5s0-2-2-2H5S3 3 3 5v2s0 2 2 2h20z'/%3E%3Cpath fill='%2355ACEE' d='M13 21s2 0 2-2v-6s0-2-2-2H5s-2 0-2 2v6s0 2 2 2h8z'/%3E%3C/svg%3E") no-repeat;
    background-size: 100% 100%;
    background-color: transparent;
    width: 1.2em;
    height: 1.2em;
  }
  .i-twemoji-thinking-face {
    background: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 36 36' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Ccircle cx='18' cy='17.018' r='17' fill='%23FFCB4C'/%3E%3Cpath fill='%2365471B' d='M14.524 21.036a.914.914 0 0 1-.312-.464a.799.799 0 0 1 .59-1.021c4.528-1.021 7.577 1.363 7.706 1.465c.384.306.459.845.173 1.205c-.286.358-.828.401-1.211.097c-.11-.084-2.523-1.923-6.182-1.098a.91.91 0 0 1-.764-.184z'/%3E%3Cellipse cx='13.119' cy='11.174' fill='%2365471B' rx='2.125' ry='2.656'/%3E%3Cellipse cx='24.375' cy='12.236' fill='%2365471B' rx='2.125' ry='2.656'/%3E%3Cpath fill='%23F19020' d='M17.276 35.149s1.265-.411 1.429-1.352c.173-.972-.624-1.167-.624-1.167s1.041-.208 1.172-1.376c.123-1.101-.861-1.363-.861-1.363s.97-.4 1.016-1.539c.038-.959-.995-1.428-.995-1.428s5.038-1.221 5.556-1.341c.516-.12 1.32-.615 1.069-1.694c-.249-1.08-1.204-1.118-1.697-1.003c-.494.115-6.744 1.566-8.9 2.068l-1.439.334c-.54.127-.785-.11-.404-.512c.508-.536.833-1.129.946-2.113c.119-1.035-.232-2.313-.433-2.809c-.374-.921-1.005-1.649-1.734-1.899c-1.137-.39-1.945.321-1.542 1.561c.604 1.854.208 3.375-.833 4.293c-2.449 2.157-3.588 3.695-2.83 6.973c.828 3.575 4.377 5.876 7.952 5.048l3.152-.681z'/%3E%3Cpath fill='%2365471B' d='M9.296 6.351a.925.925 0 0 1-.391-.399a.8.8 0 0 1 .393-1.112c4.266-1.831 7.699-.043 7.843.034c.433.231.608.747.391 1.154c-.216.405-.74.546-1.173.318c-.123-.063-2.832-1.432-6.278.047a.915.915 0 0 1-.785-.042zm12.135 3.75a.924.924 0 0 1-.362-.424a.8.8 0 0 1 .468-1.084c4.381-1.536 7.685.48 7.823.567c.415.26.555.787.312 1.178c-.242.39-.776.495-1.191.238c-.12-.072-2.727-1.621-6.267-.379a.924.924 0 0 1-.783-.096z'/%3E%3C/svg%3E") no-repeat;
    background-size: 100% 100%;
    background-color: transparent;
    width: 1.2em;
    height: 1.2em;
  }
}
</style>
