<script setup>
import dates from "~/utility/dates"


let router = useRouter()
let posterStore = usePoster()
let userStore = useAuth()

const isActive = ref(false)
let posterId = ref('')
let poster = ref({})
let scale = ref(false)

let getPoster = async (id) => {

  poster.value = await posterStore.getById(id)

}

async function moderate() {



  let res = await posterStore.moderatePoster(poster.value._id, poster.value.creator)
  if (res.status == 200) {
    // обновить свои остатки афиш
    userStore.getSubscriptionCount(userStore.user._id)
    navigateTo('/admin/moderation/onmoderation')
  }

}
async function reject() {
  let res = await posterStore.rejectPoster(poster.value._id, poster.value.moderationMessage)
  if (res.status == 200) {
    navigateTo('/admin/moderation/onmoderation')
  }
}
watch(posterId, () => {
  getPoster(posterId.value)
})

onMounted(async () => {
  posterId.value = router.currentRoute.value.query._id

})
</script>
<template >
  <div>
    <v-container class="pa-0">
      <v-responsive>
        <v-row>
          <v-col>
            <BackButton />
          </v-col>
        </v-row>
        <v-row v-if="poster" class="pb-4">
          <v-col cols="12" md="6">
            <div>
              <v-row>
                <v-col cols="12" sm="6">
                  <b>Замечания</b>
                  <div>
                    <v-textarea rows="1" auto-grow variant="outlined" placeholder="качество плаката"
                      v-model="poster.moderationMessage"></v-textarea>
                  </div>
                  <div class="d-flex justify-space-between  flex-sm-column ">
                    <v-btn class="ma-1" color="accent" @click="reject" :flat="true">отказать</v-btn>
                    <v-btn class="ma-1" @click="moderate" color="success" :flat="true">принять</v-btn>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" @click="scale = true" style="cursor: pointer;">
                  <v-img :src="poster.image">

                  </v-img>
                </v-col>
              </v-row>

            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="posterView pb-16">
              <div class="title">
                <div class="text-center text-lowercase">{{ poster.eventType ? poster?.eventType.join(' | ') : '' }}</div>
                <!-- <div class="text-center text-lowercase">{{ poster.eventSubtype.join(', ') }}</div> -->
                <h3 class="text-center">{{ poster.title }}</h3>
                <v-divider class="md-4"></v-divider>
              </div>



              <div v-html="poster.description"></div>
              <v-divider class="md-4"></v-divider>
              <div> <b>Место:</b> {{ poster.eventLocation?.name }}</div>
              <div> <b>Организатор:</b> {{ poster.organizer }}</div>
              <div v-if="poster.date?.length" class="d-flex">
                <div><b>Время начала:&nbsp;</b></div>
                <div>
                  <div v-for="eventDate in poster.date">
                    {{ dates.dateWithTime(eventDate) }}
                  </div>
                </div>


              </div>
              <div v-if="poster.email"> <b>Email:</b> {{ poster.email }}</div>
              <div v-if="poster.site"> <b> Сайт:</b> {{ poster.site }}</div>
              <div v-if="poster.phone"> <b>Телефон:</b> {{ poster.phone }}</div>
            </div>
          </v-col>
        </v-row>
      </v-responsive>

    </v-container>

    <v-dialog v-model="scale" width="auto">
      <v-img :src="poster.image" @click="scale = false" style="height: 95dvh; aspect-ratio: 210 / 297; cursor: pointer;">
      </v-img>
    </v-dialog>
  </div>
</template>
<style scoped></style>~/PLUGINS_TEMP/dates~/stores/poster~/stores/auth