<script setup>
let posterStore = usePoster()
let locationsStore = useLocations()
let authStore = useAuth()

let { location } = storeToRefs(locationsStore)
let filter = reactive({

})
let locationQuery = ref('')
let drawer = ref(false)
let showFilter = ref(false)
let showAddPlace = ref(false)
let isFiltered = ref(false)


let shortLocationName = computed(() => {
  return location.value.split(" ").at(-1)
})

let routeTo = (path) => {
  navigateTo(path)
}

let closeFilter = async () => {

  filter = JSON.parse(localStorage.getItem('filterForm'))
  posterStore.filter = filter
  showFilter.value = false
}
let checkFilter = async () => {
  if (localStorage.getItem('filterForm')) {
    let filter = JSON.parse(localStorage.getItem('filterForm'))
    posterStore.filter = filter
    for (const key in filter) {
      if (key == "eventType") {
        if (filter.eventType.length)
          isFiltered.value = true
        break
      } else {
        if (filter[key]) {
          isFiltered.value = true
          break
        }
      }
      isFiltered.value = false
      if (filter[key]) {
        if (filter.eventType.length)
          isFiltered.value = true
        break
      }
    }
  }
}

// shorten names in response.data

watch(location, async (newValue, oldValue) => {
  if (location.value) {
    locationsStore.location = location.value
    localStorage.setItem('location', location.value)

  } else {
    locationsStore.location = ''
    localStorage.setItem('location', '');
  }
  showAddPlace.value = false
  posterStore.posters = []
  posterStore.page = 1
  await posterStore.fetchPosters(filter)

})
watch(showFilter, () => {
  checkFilter()
})
let setApp = async () => {
  await useAppStore().getAppState()
  await locationsStore.fetchLocations()
  if (!authStore.isAuth)
    await authStore.checkAuth()
}
onMounted(async () => {
  await setApp()
  checkFilter()
})
</script>

<template>
  <v-app>
    <v-app-bar :elevation="0">
      <v-container>
        <v-row class="d-flex flex-nowrap justify-space-between align-center">
          <div>
            
          </div>
          <div class="d-flex align-center">

            <v-icon :class="{ active: isFiltered }" icon="mdi-filter-outline" @click="showFilter = !showFilter"></v-icon>

            <v-btn :ripple="false" class="rounded text-body-1 font-weight-regular disabled"
              style="letter-spacing: normal !important; height: 40px;" prepend-icon="mdi-map-marker-outline">
              {{ location ? shortLocationName : "Место" }}
            </v-btn>

          </div>
        </v-row>

      </v-container>
    </v-app-bar>

    <v-dialog transition="scale-transition" v-model="showFilter" fullscreen>
      <v-card>
        <Filter @closeDialog="closeFilter()" :isStartPage="false" />
      </v-card>
    </v-dialog>

    <v-main class="pb-0">
    
      <NuxtPage />

    </v-main>

    <Bottom class="d-flex d-sm-none" />
  </v-app>
</template>

<style lang="scss" scoped>
.header {
  border-radius: 0 0 10px 10px;
}

.logo {
  height: 50px;
}

.active {
  color: #ED413E;
}
</style>
