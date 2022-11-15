<script setup lang="ts">

</script>

<template>
  <div class="footer">
    <div class="container">
      <slot name="top" />
      <Content class="content" />
      <slot name="bottom" />
    </div>
  </div>
</template>

<style scoped>
.footer{
  padding-top: var(--header-height)
}
</style>
