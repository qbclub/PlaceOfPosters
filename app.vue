<script setup>
// useHead({
//   title: 'Место для афиш',
//   meta: [
//     { name: 'description', content: 'PlPo:place of posters - место для ваших афиш. Спектакль, концерт, встреча, лекция, распродажа, экскурсия, кино - любое событие может стать плакатом на PlPo"' },
//     { name: 'keywords', content: 'Спектакль, концерт, встреча, лекция, распродажа, экскурсия, кино, отдых, развлечение, плакат, афиша, мероприятия' },
//     { name: 'og:title', content: 'PlPo:place of posters' },
//     { name: 'og:description', content: 'PlPo:place of posters - место для ваших афиш. Спектакль, концерт, встреча, лекция, распродажа, экскурсия, кино - любое событие может стать плакатом на PlPo' },
//     { name: 'og:image', content: 'https://plpo.ru/android-chrome-512x512.png' },
//     { name: 'og:url', content: 'https://plpo.ru/' },
//   ],
// })
// noscript: [
//     { innerHTML: '<div><img src="https://mc.yandex.ru/watch/97443215" style="position:absolute; left:-9999px;" alt="" /></div>' }
//   ],
//   __dangerouslyDisableSanitizersByTagID: {
//     'noscript': ['innerHTML']
//   }
useSeoMeta({
  charset: 'utf-8',
  lang:'ru',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0',
  title: 'Место для афиш',
  description: 'PlPo:place of posters - место для ваших афиш. Спектакль, концерт, встреча, лекция, распродажа, экскурсия, кино - любое событие может стать плакатом на PlPo"',
  // keywords: 'спектакль, концерт, встреча, лекция, распродажа, экскурсия, кино, отдых, развлечение, плакат, афиша, мероприятия, представление,выступление,собрание,акция,кинопоказ,отпуск,развлечения,баннер,постер,программа,события',
  keywords: 'спектакль, концерт, встреча, лекция, кино, развлечение, плакат, афиша, афиши, афиш, мероприятия, афиши Глазов, мероприятия Глазов,афиши Киров, мероприятия Киров, куда сходить в, расписание',
  ogTitle: 'PlPo:place of posters',
  ogDescription: 'PlPo:place of posters - место для ваших афиш. Спектакль, концерт, встреча, лекция, распродажа, экскурсия, кино - любое событие может стать плакатом на PlPo',
  ogImage: 'https://plpo.ru/android-chrome-512x512.png',
  ogUrl: 'https://plpo.ru/',
  icon:'https://plpo.ru/favicon-16x16.png',
  twitterTitle: 'PlPo:place of posters',
  twitterDescription: 'PlPo:place of posters - место для ваших афиш. Спектакль, концерт, встреча, лекция, распродажа, экскурсия, кино - любое событие может стать плакатом на PlPo"',
  twitterImage: 'https://plpo.ru/android-chrome-512x512.png',
  twitterCard: 'summary'
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
