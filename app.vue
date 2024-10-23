<script setup>
useHead({
  title: 'Место для афиш',
  meta: [
    { name: 'description', content: 'PlPo:place of posters - место для ваших афиш. Спектакль, концерт, встреча, лекция, распродажа, экскурсия, кино - любое событие может стать плакатом на PlPo"' },
    { name: 'keywords', content: 'Спектакль, концерт, встреча, лекция, распродажа, экскурсия, кино, отдых, развлечение, плакат, афиша, мероприятия' },
    { name: 'og:title', content: 'PlPo:place of posters' },
    { name: 'og:description', content: 'PlPo:place of posters - место для ваших афиш. Спектакль, концерт, встреча, лекция, распродажа, экскурсия, кино - любое событие может стать плакатом на PlPo' },
    { name: 'og:image', content: 'https://plpo.ru/android-chrome-512x512.png' },
    { name: 'og:url', content: 'https://plpo.ru/' },
  ],
  // noscript: [
  //     { innerHTML: '<div><img src="https://mc.yandex.ru/watch/97443215" style="position:absolute; left:-9999px;" alt="" /></div>' }
  //   ],
  //   __dangerouslyDisableSanitizersByTagID: {
  //     'noscript': ['innerHTML']
  //   }
})

</script>
<template>

  <NuxtPwaManifest />
  <NuxtLayout>
  </NuxtLayout>
  <!-- <noscript>
    <div>
      <img src="https://mc.yandex.ru/watch/97443215" style="position:absolute; left:-9999px;" alt="" />
    </div>
  </noscript> -->
</template>
