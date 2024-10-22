<script setup>
let posterStore = usePoster();
let locationsStore = useLocations();
let authStore = useAuth();

let { location } = storeToRefs(locationsStore);
let { filter } = storeToRefs(posterStore);
let locationQuery = ref("");
let drawer = ref(false);
let showFilter = ref(false);
let showAddPlace = ref(false);
let isFiltered = ref(false);

let shortLocationName = computed(() => {
  return location.value.split(" ").at(-1);
});

let routeTo = (path) => {
  navigateTo(path);
};

let closeFilter = async () => {
  filter.value = JSON.parse(localStorage.getItem("filterForm"));
  posterStore.filter = filter.value;
  navigateTo("/posters");
  showFilter.value = false;
};
let checkFilter = async () => {
  if (localStorage.getItem("filterForm")) {
    // filter.value = JSON.parse(localStorage.getItem('filterForm'))
    posterStore.filter = filter.value;
    // for (const key in filter) {
    //   if (key == "eventType") {
    //     if (filter.value.eventType.length)
    //       isFiltered.value = true
    //     break
    //   }
    //   else {
    //     if (filter.value[key]) {
    //       isFiltered.value = true
    //       break
    //     }
    //   }
    //   isFiltered.value = false
    //   if (filter.value[key]) {
    //     if (filter.value.eventType.length)
    //       isFiltered.value = true
    //     break
    //   }
    // }
    if (
      filter.value.searchText == "" &&
      filter.value.date == "" &&
      filter.value.posterType == "" &&
      filter.value.eventType.length == 0 &&
      filter.value.eventSubtype.length == 0
    ) {
      isFiltered.value = false;
    } else {
      isFiltered.value = true;
    }
  }
};

// shorten names in response.data

watch(location, async (newValue, oldValue) => {
  if (location.value) {
    locationsStore.location = location.value;
    localStorage.setItem("location", location.value);
  } else {
    locationsStore.location = "";
    localStorage.setItem("location", "");
  }
  showAddPlace.value = false;
  posterStore.posters = [];
  posterStore.page = 1;
  await posterStore.fetchPosters(filter.value);
});
watch(filter, () => {
  checkFilter();
},{deep:true});
let setApp = async () => {
  await useAppStore().getAppState();
  await locationsStore.fetchLocations();
  if (!authStore.isAuth) await authStore.checkAuth();
};

onMounted(async () => {
  await setApp();
  filter.value = JSON.parse(localStorage.getItem("filterForm"));
  checkFilter();
});
</script>

<template>
  <v-app>
    <v-app-bar :elevation="0">
      <v-container>
        <v-row class="d-flex flex-nowrap justify-space-between align-center">
          <div>
            <img
              src="@/assets/logo.webp"
              class="logo cursor-pointer"
              @click="navigateTo('/posters')"
            />
          </div>
          <div class="d-flex align-center">
            <v-icon
              :class="{ active: isFiltered }"
              icon="mdi-filter-outline"
              @click="showFilter = !showFilter"
            ></v-icon>

            <div
              @click="showFilter = !showFilter"
              class="d-flex align-center pa-1 ml-4"
              style="cursor: pointer"
            >
              <v-icon>mdi-map-marker-outline</v-icon>

              <div
                class="text-body-1 font-weight-regular"
                style="letter-spacing: normal !important; margin-left: 8px"
              >
                {{ location ? shortLocationName : "Везде" }}
              </div>
            </div>

            <v-icon
              class="d-none d-sm-flex ml-4"
              icon="mdi-menu"
              @click.stop="drawer = !drawer"
            ></v-icon>
          </div>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-dialog transition="scale-transition" close-on-back v-model="showFilter" fullscreen>
      <v-card>
        <Filter @closeDialog="closeFilter()" :isStartPage="false" />
      </v-card>
    </v-dialog>

    <v-navigation-drawer v-model="drawer" location="right" temporary elevation="0">
      <ClientOnly>
        <v-list nav>
          <!-- <v-list-item class="cursor-pointer" prepend-icon="mdi-post" to="/" exact :ripple="false">
          Домой
        </v-list-item> -->
          <v-list-item
            class="cursor-pointer"
            prepend-icon="mdi-post"
            to="/posters"
            exact
            :ripple="false"
          >
            Афиши
          </v-list-item>
          <v-list-item
            class="cursor-pointer"
            prepend-icon="mdi mdi-information-variant"
            to="/info/landing"
            exact
            :ripple="false"
          >
            Информация
          </v-list-item>
          <v-list-item
            class="cursor-pointer"
            prepend-icon="mdi-plus"
            to="/createposter"
            exact
            :ripple="false"
          >
            Создать
          </v-list-item>

          <v-list-item
            class="cursor-pointer"
            prepend-icon="mdi-account"
            to="/cabinet/me"
            exact
            :ripple="false"
          >
            Кабинет
          </v-list-item>

          <v-list-item
            class="cursor-pointer"
            prepend-icon="mdi-security"
            to="/admin/moderation/onmoderation"
            exact
            :ripple="false"
            v-if="authStore.user?.roles.includes('admin')"
          >
            Админ
          </v-list-item>
          <v-list-item
            class="cursor-pointer"
            prepend-icon="mdi-account-group-outline"
            to="/manager/moderation/onmoderation"
            exact
            :ripple="false"
            v-if="authStore.user?.managerIn?.length"
          >
            Менеджер
          </v-list-item>
        </v-list>
      </ClientOnly>
    </v-navigation-drawer>

    <v-main class="pb-0">
      <NuxtPage />

      <v-snackbar v-model="useShowingErrors().value.show" color="accent" timeout="2000">
        {{ useShowingErrors().value.message }}
        <template v-slot:actions>
          <v-btn
            @click="useShowingErrors().value.show = false"
            density="compact"
            icon="mdi-close"
          ></v-btn>
        </template>
      </v-snackbar>
    </v-main>
    <ClientOnly>
      <Bottom class="d-flex d-sm-none" />
    </ClientOnly>
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
  color: #ed413e;
}
</style>
