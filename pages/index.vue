<script setup>
import Filter from "../components/Filter.vue"
let isStartPage = ref(true)

definePageMeta({
  middleware: () => {
    if (process.server)
      return
    if (localStorage.getItem('location') || localStorage.getItem('filterForm'))
      return navigateTo('/posters')
  }
})
</script>

<template>
  <Filter :isStartPage = "isStartPage" />
</template>

<style lang="scss" scoped>

</style>