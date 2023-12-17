<script setup>
const runtimeConfig = useRuntimeConfig()

import { useShare } from '@vueuse/core'
import dates from "~/utility/dates"

let router = useRouter()
const route = useRoute();
let poster = ref({})

let posterLink = computed(() => {
  return runtimeConfig.public.siteUrl + '/post?_id=' + poster.value._id
})

const options = ref({
  url: posterLink.value,
})

const { isSupported } = useShare(options)

const posterId = route.query?._id

function startShare() {
  options.value.url = posterLink.value

  const { share } = useShare(options)

  return share().catch(err => {
    console.log(err);
  })
}

let getHref = (link) => {
  return link
}

let { data: posterFromDB, pending } = await useFetch('/poster/get-by-id', {
  baseURL: runtimeConfig.public.apiBase,
  method: "GET",
  query: { _id: posterId }
})
poster.value = posterFromDB.value
</script>
<template>
  <v-container>

    <Head>
      <Title>{{ poster.title }}</Title>
      <Meta name="og:title" :content="poster.title" />
      <!-- 210 / 297 aspect ratio -->
      <Meta name="og:image:height" :content="Number(400 * 297 / 210).toString()" />
      <Meta name="og:image:width" :content="Number(400 * 210 / 297).toString()" />

      <meta property="vk:image" :content="poster.image" />
      <Meta name="description" :content="poster.eventType ? poster?.eventType.join(' | ') : ''" />
      <meta property="og:site_name" content="PlPo - Place Of Posters" />
      <Meta name="og:url" :content="posterLink" />
    </Head>

    <v-responsive>
      <v-row>
        <v-col>
          <!-- router.replace({ hash: "#bio" }) -->
          <div @click="router.replace({ path: '/posters', hash: `#${poster._id}` })"
            class="pa-1 cursor-pointer text-body-1">
            <span class="mdi mdi-arrow-left"></span> назад
          </div>
        </v-col>
      </v-row>
      <v-row v-if="!pending && poster?._id" class="pb-4">
        <v-col @click="router.push({ path: '/posters', hash: `#${poster._id}` })" cols="12" md="6">
          <div class="posterView">
            <v-img :src="poster.image" class="front">
            </v-img>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="posterView pb-16">
            <div class="title">
              <div class="text-center text-lowercase">{{ poster.eventType ? poster?.eventType.join(' | ') : '' }}</div>
              <!-- <div class="text-center text-lowercase">{{ poster.eventSubtype.join(', ') }}</div> -->
              <h3 class="text-center">{{ poster.title }}</h3>
              <v-divider class="ma-4"></v-divider>
            </div>
            <div v-html="poster.description"></div>
            <v-divider class="ma-4"></v-divider>
            <div style="position: relative;">
              <div class="float-right"><span style="cursor: pointer; opacity: 0.8;"
                  class="mdi mdi-24px mdi-share-variant-outline ma-8 " @click="startShare()" v-if="isSupported">
                </span></div>
              <div> <b>Место:</b> <a :href="`https://2gis.ru/search/${poster.eventLocation.name}`">{{
                poster.eventLocation.name }}</a> </div>
              <div v-if="poster.date?.length" class="d-flex">
                <div><b>Время начала:&nbsp;</b></div>
                <div>
                  <div v-for="eventDate in poster.date">
                    {{ dates.dateWithTime(eventDate) }}
                  </div>
                </div>
              </div>
              <!-- <div v-if="poster.workingTime"> <b>Режим работы:</b> {{ poster.workingTime }}</div> -->
              <div v-if="poster.price"> <b>Стоимость:</b> {{ poster.price }}</div>
              <div v-if="poster.organizer"> <b>Организатор:</b> {{ poster.organizer }}</div>
              <div v-if="poster.ageLimit"> <b>Возраст:</b> {{ poster.ageLimit }}</div>
              <div v-if="poster.email"> <b>Email:</b> <a :href="getHref(`mailto:${poster.email}`)">{{ poster.email }}</a>
              </div>
              <div v-if="poster.site"> <b> Сайт:</b> <a :href="poster.site" target="_blank">{{ poster.site }}</a> </div>
              <div v-if="poster.phone"> <b>Телефон:</b> <a :href="getHref(`tel:${poster.phone}`)"> {{ poster.phone }}</a>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>
<style scoped>
.posterView {
  height: 80dvh;
  overflow: auto;

}

.front {
  cursor: pointer;
}

.title {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.9);
}

@media only screen and (max-width: 860px) {
  .posterView {
    height: auto;
    width: 100%;
    overflow: auto;

  }
}
</style>~/PLUGINS_TEMP/dates~/stores/poster