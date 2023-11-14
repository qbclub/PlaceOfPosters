<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from "vue-router"
import { usePoster } from '~/store/poster';
import { useHead } from '@unhead/vue'
import { useShare } from '@vueuse/core'
import dates from "~/utility/dates"

const API_URL = import.meta.env.VITE_API_URL


const isActive = ref(false)

let router = useRouter()
const route = useRoute();
let posterStore = usePoster()
let poster = ref()

const options = ref({

    url: getLink(),
  })

const { share, isSupported } = useShare(options)

const posterId = router.currentRoute.value.query?._id



function startShare() {
  return share().catch(err => err)
}


function getLink() {
  return API_URL + route.fullPath
}

let getHref = (link) => {
  return link
}

onMounted(async () => {
  if (posterId) {
    let localPoster = posterStore.posters.find((p) => p._id == posterId)
    if (!localPoster) {
      poster.value = await posterStore.getById(posterId)
    } else {
      poster.value = localPoster
    }
  }
  useHead({
    // title: poster.value?.title,
    meta: [
      {
        property: 'vk:image',
        content: poster.value?.image
      },
      {
        property: "og:title",
        content: poster.value?.title
      },
      {
        property:"og:image",
        content: poster.value?.image
      },
      {
        property:"og:url",
        content: getLink()
      },
    
      
    ],
  })
})

</script>
<template >
  <v-container>
    <v-responsive>
      <v-row>
        <v-col>
          <div @click="router.push({ path: '/posters', hash: `#${poster._id}` })" class="pa-1 cursor-pointer text-body-1">
            <span class="mdi mdi-arrow-left"></span> назад
          </div>
        </v-col>
      </v-row>
      <v-row v-if="poster" class="pb-4">
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
</style>~/PLUGINS_TEMP/dates