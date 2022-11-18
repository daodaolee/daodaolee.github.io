<script setup lang="ts">
import { useData } from 'vitepress'
// import { toRaw } from 'vue'
const { theme } = useData()
const movies = theme.value.movies

const toDouban = (link: string) => {
  window.open(link)
}
</script>

<template>
  <div class="pt-25 max-w-121ch mx-auto px-6 md:px-0 pb-15">
    <div class="movie flex flex-wrap px-10">
      <div
        v-for="(movie, index) in movies" 
        :key="index" 
        class="flex flex-wrap pt-20 relative"
        @click="toDouban(movie.link)"
      >
        <div v-if="movie.date" absolute top-0 h20 pointer-events-none>
          <span text-8em op10 absolute left--3rem top--2rem font-bold>{{ movie.date }}</span>
        </div>
        <div v-for="m in movie.movie" :key="m.title" class=" movie-item cursor-pointer w-35 mb-10 text-center">
          <img class="w-100% h-50 border-rd" :src="m.photo" :alt="movie.title">
          <p class="mt-0 mb-0  text-0.9rem op-70 hover:op-100 transition-colors-400">
            {{ m.title }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.movie-item{
  &:not(:nth-child(6n+1)){
    margin-right: 3rem
  }
}
@media screen and (max-width: 768px){
  .movie{
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .movie-item{
    margin-left: 1rem;
    &:not(:nth-child(6n+1)){
      margin-right: 0
    }
  }
}
@media (min-width: 768px) and (max-width: 1200px){
  .movie-item{
    margin-left: 1rem;
    &:not(:nth-child(6n+1)){
      margin-right: 0
    }
  }
}
</style>