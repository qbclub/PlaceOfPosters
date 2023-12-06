<script setup>
import { getData, setData } from 'nuxt-storage/local-storage';
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

  filter = getData('filterForm')
  posterStore.filter = filter
  showFilter.value = false
}
let checkFilter = async () => {
  if (getData('filterForm')) {
    let filter = getData('filterForm')
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

let setApp = async () => {
  await useAppStore().getAppState()
  await locationsStore.fetchLocations()
}



// shorten names in response.data

watch(location, async (newValue, oldValue) => {
  if (location.value) {
    locationsStore.location = location.value
    setData('location', location.value, 30, 'd')

  } else {
    locationsStore.location = ''
    setData('location', '', 30, 'd');
  }
  showAddPlace.value = false
  posterStore.posters = []
  posterStore.page = 1
  await posterStore.fetchPosters(filter)

})
watch(showFilter, () => {
  checkFilter()
})

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
            <img src="@/assets/logo.webp" class="logo cursor-pointer" @click="routeTo('/posters')" />
          </div>
          <div class="d-flex align-center">

            <v-icon :class="{ active: isFiltered }" icon="mdi-filter-outline" @click="showFilter = !showFilter"></v-icon>

            <v-btn :ripple="false" class="rounded text-body-1 font-weight-regular disabled"
              style="letter-spacing: normal !important; height: 40px;" prepend-icon="mdi-map-marker-outline">
              {{ location ? shortLocationName : "Место" }}
            </v-btn>

            <v-icon class="d-none d-sm-block ma-2" icon="mdi-menu" @click.stop="drawer = !drawer"></v-icon>
          </div>
        </v-row>

      </v-container>
    </v-app-bar>

    <v-dialog transition="scale-transition" v-model="showFilter" fullscreen>
      <v-card>
        <Filter @closeDialog="closeFilter()" :isStartPage="false" />
      </v-card>
    </v-dialog>

    <v-navigation-drawer v-model="drawer" location="right" temporary elevation="0">
      <v-list nav>
        <v-list-item class="cursor-pointer" prepend-icon="mdi-post" to="/" exact :ripple="false">
          Домой
        </v-list-item>
        <v-list-item class="cursor-pointer" prepend-icon="mdi-post" to="/posters" exact :ripple="false">
          Афиши
        </v-list-item>
        <v-list-item class="cursor-pointer" prepend-icon="mdi mdi-information-variant" to="/info" exact :ripple="false">
          Информация
        </v-list-item>
        <v-list-item class="cursor-pointer" prepend-icon="mdi-plus" to="/createposter" exact :ripple="false">
          Создать
        </v-list-item>

        <v-list-item class="cursor-pointer" prepend-icon="mdi-account" to="/cabinet" exact :ripple="false">
          Кабинет
        </v-list-item>
        <v-list-item class="cursor-pointer" prepend-icon="mdi-security" to="/admin/moderation/onmoderation" exact
          :ripple="false" v-if="authStore.user?.roles.includes('admin')">
          Админ
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="pb-0">
      <!-- <v-container class="pt-0 pb-0">
         <v-row class="flex-column align-center justify-center ma-0">
          <v-col cols="12" sm="8" md="6" lg="5" xl="4" class="pa-0">
            <v-menu v-model="showAddPlace" :close-on-content-click="false" activator="parent" scroll-strategy="close"
              transition="scroll-y-transition">
              <v-card class="pa-6 rounded-lg">

                <v-autocomplete v-model="location" v-model:search="locationQuery" clearable variant="outlined"
                  :items="[...locationsStore.eventlocations]" item-title="name" label="Место" density="compact" />

              </v-card>
            </v-menu>
          </v-col>

          <v-col cols="12" sm="10" md="8" class="pa-0">
            <v-menu v-model="showFilter" :close-on-content-click="false" activator="parent" class="w-50"
              scroll-strategy="none" transition="scroll-y-transition">
              <v-card class="pa-6 rounded-lg">
                <Filter @closeFilter="closeFilter" />
              </v-card>
            </v-menu>
          </v-col>
        </v-row> 
      </v-container> -->
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
