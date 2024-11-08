<script setup>
import { useDisplay } from "vuetify/lib/framework.mjs";
import _ from "lodash";
import { useDate } from "vuetify";
import gsap from 'gsap'

const props = defineProps(["isStartPage", "activateCategory"]);
let emit = defineEmits(["closeDialog"]);

let router = useRouter();
let appState = await getAppState();
let locationStore = useLocations();
let posterStore = usePoster();
let loading = ref(false);
let locationCoordinates = ref([])
let fullLocations = ref([])
let locationQuery = ref('')
let locationRadius = ref(0)
let tl = gsap.timeline({ paused: true })

let showDatePicker = ref(false);

let locations = await getActiveCities();

let active_categories = ref([]);
let categories = ref([]);

// let categories = _.sortBy(appState.value.eventTypes.filter(item => active_categories.value.includes(item.name)), ['name']);

let selectedLocation = ref('');

let date_items = ["Сегодня", "На неделе", "Скоро"];

const adapter = useDate();
let date = ref();
let date_picked = ref(false);

let filter = ref({
  searchText: "",
  date: "",
  eventType: [],
  eventSubtype: [],
  posterType: "",
});

let shortName = (item) => {
  let name = item.replace("(", "").replace(")", "").split(" ");
  return name.pop();
};

async function closeDialog() {
  posterStore.posters = [];
  posterStore.page = 1;
  localStorage.setItem("locationRadius", locationRadius.value);
  localStorage.setItem("filterForm", JSON.stringify(filter.value));
  locationStore.radius = locationRadius.value
  posterStore.filter = filter.value;
  await posterStore.fetchPosters(filter.value);
  emit("closeDialog");
}
async function closePage() {
  posterStore.posters = [];
  posterStore.page = 1;
  locationStore.radius = locationRadius.value
  posterStore.filter = filter.value;
  await posterStore.fetchPosters(filter.value);
  navigateTo("/posters");
}
function clearFilter() {
  // selectedLocation.value = ''
  // localStorage.setItem('location', selectedLocation.value)
  // locationStore.location = selectedLocation.value
  // date.value = null
  filter.value = {
    searchText: "",
    date: "",
    eventType: [],
    eventSubtype: [],
    posterType: "",
  };
  localStorage.setItem("filterForm", JSON.stringify(filter.value));
  localStorage.setItem("locationRadius", 0);
  posterStore.filter = filter.value;
}

async function setActiveCategory() {
  let res = await getActiveCategories(locationStore.location);
  active_categories.value = res.value;
  if (active_categories.value.length) {
    categories.value = _.sortBy(
      appState.value.eventTypes.filter((item) =>
        active_categories.value.includes(item.name)
      ),
      ["name"]
    );
  }
}

function selectLocation(index) {
  console.log(filteredLocations.value[index])
  if (selectedLocation.value == filteredLocations.value[index]) {
    selectedLocation.value = "";
    locationStore.location = "";
  } else {
    if (selectedLocation.value ==""){
      tl.restart()
    }
    locationStore.location = fullLocations.value[index];
    if (locationCoordinates.value[index]?.length) {
      locationStore.coordinates = locationCoordinates.value[index];
      localStorage.setItem("locationCoordinates", locationCoordinates.value[index]);
    }
    selectedLocation.value = locations.value[index];
  }
  localStorage.setItem("location", fullLocations.value[index]);
}
function selectCategory(name) {
  // let name = categories.value[index].name
  let place = filter.value.eventType.indexOf(name);
  place == -1
    ? filter.value.eventType.push(name)
    : filter.value.eventType.splice(place, 1);
  localStorage.setItem("filterForm", JSON.stringify(filter.value));
  posterStore.filter = filter.value;
}
let selectPeriod = (item) => {
  if (filter.value.date == item) {
    filter.value.date = "";
  } else {
    filter.value.date = item;
  }
  date.value = null;
  localStorage.setItem("filterForm", JSON.stringify(filter.value));
  posterStore.filter = filter.value;
};
let selectDate = (item) => {
  // if (filter.value.date == item.getTime()) {
  //     filter.value.date = ''
  //     date.value = null
  // } else {
  //     filter.value.date = item.getTime()
  // }
  // showDatePicker.value = false
  // filter.value.date=filter.value.date.setHours(12,-1 * new Date(filter.value.date).getTimezoneOffset() -1 ,0,0)
  // console.log(filter.value.date)
  if (item === null) {
    filter.value.date = "";
  } else {
    filter.value.date.setUTCHours(12, 0, 0, 0);
  }
  localStorage.setItem("datePickerDate", JSON.stringify(date.value));
  localStorage.setItem("filterForm", JSON.stringify(filter.value));
  posterStore.filter = filter.value;
};

let selectPosterType = (type) => {
  if (filter.value.posterType == type) {
    filter.value.posterType = "";
  } else {
    filter.value.posterType = type;
  }
  localStorage.setItem("filterForm", JSON.stringify(filter.value));
  posterStore.filter = filter.value;
};

let isSelectedLocation = (name) => selectedLocation.value == name;

let isSelectedCategory = (name) =>
  filter.value.eventType ? filter.value.eventType.includes(name) : false;

watch(selectedLocation, async (start, end) => {
  if (end) {
    filter.value.eventType = [];
  }
  localStorage.setItem("filterForm", JSON.stringify(filter.value));
  await setActiveCategory();
});

watch(
  () => filter.value.searchText,
  () => {
    localStorage.setItem("filterForm", JSON.stringify(filter.value));
    posterStore.filter = filter.value;
  }
);

let filteredLocations = computed(() => {

  if (locationQuery.value.length > 2) {
    localStorage.setItem("locationQuery", locationQuery.value);
    return locations.value.filter((loc) => loc.toLowerCase().includes(locationQuery.value.toLowerCase())).slice(0, 3)
  } else {
    localStorage.setItem("locationQuery", '');
    return locations.value
  }
})

onMounted(async () => {
  locations.value.sort((a, b) => {
    let firstName = shortName(a.name)
    let secondName = shortName(b.name)
    if (firstName < secondName) {
      return -1;
    }
    if (firstName > secondName) {
      return 1;
    }
    return 0;
  })
  // locationCoordinates.value = locations.value.map((item) => item.coordinates)
  // fullLocations.value = locations.value.map((item) => item.fullLocation)
  // locations.value = locations.value.map((item) => shortName(item.name))

  locationQuery.value = localStorage.getItem("locationQuery") ?? '';
  locationRadius.value = Number(localStorage.getItem("locationRadius")) ?? '';

  if (!selectedLocation.value.length) {
    if (localStorage.getItem("location")) {
      let index = fullLocations.value.findIndex((item)=> item==localStorage.getItem("location"))
      selectedLocation.value = locations.value[index]
    }
  }
  if (localStorage.getItem("filterForm")) {
    filter.value = JSON.parse(localStorage.getItem("filterForm"));
    if (typeof filter.value.date == "number") {
      date.value = new Date(filter.value.date);
    }
    posterStore.filter = filter.value;
  }
  await setActiveCategory();

  tl.to('.gsap-radius-show', {
    duration: 0.25,
    y: 25
  });
  tl.to('.gsap-radius-show', {
    duration: 0.25,
    opacity: 1,
    y: 0
  });
  tl.play()
  
});

if (props.isStartPage) {
  loading.value = true;
  useNuxtApp().hook("page:finish", () => (loading.value = false));
}
</script>

<template>
  <v-container>
    <ClientOnly>
      <div v-if="loading" class="mt-10 w-100">
        <v-skeleton-loader max-width="300" class="ma-auto d-flex justify-center" type="text" />
        <v-skeleton-loader min-width="100" class="ma-auto d-flex justify-center"
          type="button, button, button, button, button, button, button, button" />
        <v-skeleton-loader min-width="100" class="ma-auto d-flex justify-center"
          type="button, button, button, button, button, button, button" />
      </div>

      <v-row class="flex-column justify-center align-center" style="position:relative">
        <!-- <div class="close-icon"> -->
          <v-icon @click="emit('closeDialog')" icon="mdi-close" size="large" class="close_icon">
          </v-icon>
        <!-- </div> -->
        <v-col v-if="isStartPage" cols="auto" class="pb-0">
          <h2>Настрой для себя</h2>
        </v-col>
        <v-col v-if="!isStartPage" cols="10" sm="6">
          <v-text-field v-model="filter.searchText" variant="outlined" density="compact" label="Поиск" hide-details
            clearable></v-text-field>
        </v-col>

        <v-col cols="8" class="d-flex justify-center" style="gap: 5px">
          <div style="width:100px; margin-right:20px; ">
          <v-text-field label="Найти город" variant="underlined" v-model="locationQuery" hide-details></v-text-field>
          </div>
          <div v-for="(location, index) in filteredLocations">
              <v-btn 
              @click="selectLocation(index)"
              :class="isSelectedLocation(location) ? 'bg-red' : ''"
              :ripple="false"
              class="rounded-pill btn mt-4"
              :size="useDisplay().mdAndUp.value ? undefined : 'small'" style="animation: blink" variant="flat">
              {{`${index} ${location}` }} 
              </v-btn>
            </div>
        </v-col>
        <v-col cols="2" class="gsap-radius-show py-0" v-show="selectedLocation != ''">
          <v-slider v-model="locationRadius" :step="100" :min="0" :max="1800" density="compact" hide-details color="#ED413E" thumb-size="15" />
          <div style="text-align: center;">
            {{selectedLocation + ' + ' + locationRadius }} км.
          </div>
        </v-col>

        <v-col cols="8" v-if="!isStartPage">
          <v-divider />
        </v-col>

        <v-col v-if="!isStartPage" cols="auto" class="d-flex justify-center flex-wrap" style="gap: 5px">
          <v-btn v-for="(item, index) in date_items" @click="selectPeriod(item)"
            :class="filter.date == item ? 'bg-red' : ''" class="rounded-pill btn" :ripple="false"
            style="animation: blink" :size="useDisplay().mdAndUp.value ? undefined : 'small'" variant="flat">
            {{ item }}
          </v-btn>

          <v-btn :class="new Date(filter.date) != 'Invalid Date' ? 'bg-red' : ''" icon="mdi-calendar"
            density="comfortable" variant="flat" @click="showDatePicker = !showDatePicker" :ripple="false" />
        </v-col>
        <v-col cols="auto" v-show="showDatePicker">
          <VueDatePicker locale="ru" v-model="filter.date" input-class-name="dp-custom-input"
            :enable-time-picker="false" @update:model-value="selectDate(filter.date)" cancel-text="отмена"
            select-text="выбрать" placeholder="дата" timezone="UTC" :transitions="{ open: 'fade', close: 'fade' }"
            :flow="['calendar']" format="dd/MM/yyyy" />
        </v-col>

        <v-col cols="8">
          <v-divider />
        </v-col>

        <v-col cols="auto" class="d-flex justify-center flex-wrap" style="gap: 5px">
          <v-btn @click="selectPosterType('event')" :class="filter.posterType == 'event' ? 'bg-red' : ''"
            class="rounded-pill btn" :ripple="false" style="animation: blink"
            :size="useDisplay().mdAndUp.value ? undefined : 'small'" variant="flat">
            Событие
          </v-btn>

          <v-btn @click="selectPosterType('place')" :class="filter.posterType == 'place' ? 'bg-red' : ''"
            class="rounded-pill btn" :ripple="false" style="animation: blink"
            :size="useDisplay().mdAndUp.value ? undefined : 'small'" variant="flat">
            Место
          </v-btn>
        </v-col>

        <v-col cols="8">
          <v-divider />
        </v-col>
        <v-col cols="12" class="d-flex justify-center flex-wrap" style="gap: 5px">
          <v-btn v-for="(category, index) in categories" @click="selectCategory(category.name)"
            :class="isSelectedCategory(category.name) ? 'bg-red' : ''" class="rounded-pill btn" :ripple="false"
            style="animation: blink" :size="useDisplay().mdAndUp.value ? undefined : 'small'" variant="flat">
            {{ category.name }}
          </v-btn>
          <v-btn class="rounded-pill btn text-accent" :ripple="false" style="animation: blink"
            :size="useDisplay().mdAndUp.value ? undefined : 'small'" variant="outlined" @click="clearFilter()">
            убрать
          </v-btn>
        </v-col>
        <v-col cols="12" class="d-flex justify-space-around flex-wrap mb-16">
          <v-btn @click="isStartPage ? closePage() : closeDialog()" class="rounded-lg text-accent" variant="outlined"
            :ripple="false" size="large">
            Показать афиши
          </v-btn>

          <!-- <v-btn v-if="!isStartPage" @click="clearFilter()" class="rounded-lg text-accent" variant="outlined" :ripple="false"
                    size="large">
                    Очистить фильтр
                </v-btn> -->
        </v-col>
      </v-row>
    </ClientOnly>
  </v-container>
</template>

<style lang="scss" scoped>
$red: #ff0000;
$white: #ffffff;

@keyframes blink {
  0% {
    background: $white;
  }

  33% {
    background: $red;
  }

  66% {
    background: $white;
  }

  100% {
    background: $red;
  }
}

.gsap-radius-show {
  opacity: 0
}

.btn.bg-red {
  animation: blink 1s;
}
.close_icon{
  position: absolute;
  right:10px;
  top:10px
}
</style>
