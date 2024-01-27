<script setup>
useHead({
  title: 'Place of posters',
  meta: [
    { name: 'description', content: 'PlPo:place of posters - место для ваших афиш. Спектакль, концерт, встреча, лекция, распродажа, экскурсия, кино - любое событие может стать плакатом на PlPo"' },
    { name: 'keywords', content: 'Спектакль, концерт, встреча, лекция, распродажа, экскурсия, кино, отдых, развлечение, плакат, афиша, мероприятия' },
    { name: 'og:title', content: 'PlPo:place of posters' },
    { name: 'og:description', content: 'PlPo:place of posters - место для ваших афиш. Спектакль, концерт, встреча, лекция, распродажа, экскурсия, кино - любое событие может стать плакатом на PlPo' },
    { name: 'og:image', content: 'https://plpo.ru/android-chrome-512x512.png' },
    { name: 'og:url', content: 'https://plpo.ru/' },
  ],
})
if (!process.server) {
  let { filter } = storeToRefs(usePoster())
  filter.value = JSON.parse(localStorage.getItem('filterForm')) ?? {
    searchText: '',
    date: '',
    eventType: [],
    eventSubtype: [],
    posterType: ''
  }
  
  watch(filter, (value) => {
    localStorage.setItem('filterForm', JSON.stringify(value))
    console.log(value)
  })
}
</script>
<template>

  <NuxtPwaManifest />
  <NuxtLayout>
  </NuxtLayout>
</template>
