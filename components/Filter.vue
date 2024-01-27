<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs';
import _ from 'lodash'

const props = defineProps(['isStartPage'])
let emit = defineEmits(['closeDialog'])

let router = useRouter()
let appState = await getAppState()
let locationStore = useLocations()
let posterStore = usePoster()
let loading = ref(false)

let locations = await getEventLocations()
let active_categories = await getActiveCategories()
let categories =  _.sortBy(appState.value.eventTypes.filter(item => active_categories.value.includes(item.name)), ['name']);  

let selectedLocation = ref('')

let date_items = [
    'Сегодня',
    'На неделе',
    'Скоро',
]

let filter = ref({
    searchText: '',
    date: '',
    eventType: [],
    eventSubtype: [],
    posterType: ''
})

let shortName = (item) => {
    return item.name.split(' ').pop()
}

async function closeDialog() {
    posterStore.posters = []
    posterStore.page = 1
    await posterStore.fetchPosters(filter.value)
    emit('closeDialog')
}
async function closePage() {
    posterStore.posters = []
    posterStore.page = 1
    posterStore.filter = filter.value
    await posterStore.fetchPosters(filter.value)
    navigateTo('/posters')
}
function clearFilter() {
    // selectedLocation.value = ''
    // localStorage.setItem('location', selectedLocation.value)
    // locationStore.location = selectedLocation.value

    filter.value = {
        searchText: '',
        date: '',
        eventType: [],
        eventSubtype: [],
        posterType: ''
    }
    localStorage.setItem('filterForm', JSON.stringify(filter.value))
    posterStore.filter = filter.value
}

function selectLocation(index) {
    if (selectedLocation.value == locations.value[index].name) {
        selectedLocation.value = ''
        locationStore.location = ''
    } else {
        locationStore.location = locations.value[index].name
        selectedLocation.value = locationStore.location
    }
    localStorage.setItem('location', selectedLocation.value)
}
function selectCategory(index) {
    let name = categories[index].name
    let place = filter.value.eventType.indexOf(name)
    place == -1 ? filter.value.eventType.push(name) : filter.value.eventType.splice(place, 1)
    localStorage.setItem('filterForm', JSON.stringify(filter.value))
    posterStore.filter = filter.value
}
let selectPeriod = (name) => {
    if (filter.value.date == name) {
        filter.value.date = ''

    } else {
        filter.value.date = name
    }
    localStorage.setItem('filterForm', JSON.stringify(filter.value))
    posterStore.filter = filter.value
}
let selectPosterType = (type) => {
    if (filter.value.posterType == type) {
        filter.value.posterType = ''

    } else {
        filter.value.posterType = type
    }
    localStorage.setItem('filterForm', JSON.stringify(filter.value))
    posterStore.filter = filter.value
}

let isSelectedLocation = (name) => selectedLocation.value == name

let isSelectedCategory = (name) => filter.value.eventType ? filter.value.eventType.includes(name) : false

watch(() => filter.value.searchText, () => {
    localStorage.setItem('filterForm', JSON.stringify(filter.value))
    posterStore.filter = filter.value
})

onMounted(() => {

    if (!selectedLocation.value.length) {
        if (localStorage.getItem('location')) {
            selectedLocation.value = localStorage.getItem('location')
        }
    }

    if (localStorage.getItem('filterForm')) {
        filter.value = JSON.parse(localStorage.getItem('filterForm'))
        posterStore.filter = filter.value
    }

})



if (props.isStartPage) {
    loading.value = true
    useNuxtApp().hook('page:finish', () => loading.value = false)
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

            <v-row class="flex-column justify-center align-center">
                <v-col v-if="isStartPage" cols="auto" class="pb-0">
                    <h2> Настрой для себя</h2>
                </v-col>
                <v-col v-if="!isStartPage" cols="12" sm="6">
                    <v-text-field v-model="filter.searchText" variant="outlined" density="compact" label="Поиск"
                        hide-details clearable></v-text-field>
                </v-col>
                <v-col cols="auto" class="d-flex justify-center flex-wrap" style="gap: 5px;">
                    <v-btn v-for="location, index in locations" @click="selectLocation(index)"
                        :class="isSelectedLocation(location.name) ? 'bg-red' : ''" :ripple="false" class="rounded-pill btn"
                        :size="useDisplay().mdAndUp.value ? undefined : 'small'" style="animation: blink;" variant="flat">
                        {{ shortName(location) }}
                    </v-btn>
                </v-col>
                <v-col cols="8" v-if="!isStartPage">
                    <v-divider />
                </v-col>


                <v-col v-if="!isStartPage" cols="auto" class="d-flex justify-center flex-wrap" style="gap: 5px;">
                    <v-btn v-for="item, index in date_items" @click="selectPeriod(item)"
                        :class="filter.date == item ? 'bg-red' : ''" class="rounded-pill btn" :ripple="false"
                        style="animation: blink;" :size="useDisplay().mdAndUp.value ? undefined : 'small'" variant="flat">
                        {{ item }}
                    </v-btn>
                </v-col>

                <v-col cols="8">
                    <v-divider />
                </v-col>

                <v-col cols="auto" class="d-flex justify-center flex-wrap" style="gap: 5px;">
                    <v-btn @click="selectPosterType('event')"
                        :class="filter.posterType == 'event' ? 'bg-red' : ''" class="rounded-pill btn" :ripple="false"
                        style="animation: blink;" :size="useDisplay().mdAndUp.value ? undefined : 'small'" variant="flat"
                    >
                        Событие
                    </v-btn>

                    <v-btn @click="selectPosterType('place')"
                        :class="filter.posterType == 'place' ? 'bg-red' : ''" class="rounded-pill btn" :ripple="false"
                        style="animation: blink;" :size="useDisplay().mdAndUp.value ? undefined : 'small'" variant="flat"
                    >
                        Место
                    </v-btn>
                </v-col>

                <v-col cols="8">
                    <v-divider />
                </v-col>
                <v-col cols="12" class="d-flex justify-center flex-wrap" style="gap: 5px;">
                    <v-btn v-for="category, index in categories" @click="selectCategory(index)"
                        :class="isSelectedCategory(category.name) ? 'bg-red' : ''" class="rounded-pill btn" :ripple="false"
                        style="animation: blink;" :size="useDisplay().mdAndUp.value ? undefined : 'small'" variant="flat">
                        {{ category.name }}
                    </v-btn>
                    <v-btn class="rounded-pill btn text-accent " :ripple="false" style="animation: blink;"
                        :size="useDisplay().mdAndUp.value ? undefined : 'small'" variant="outlined" @click="clearFilter()">
                        убрать
                    </v-btn>
                </v-col>

                <v-col cols="12" class="d-flex justify-space-around flex-wrap mb-16">
                    <v-btn @click="isStartPage ? closePage() : closeDialog()" class="rounded-lg text-accent "
                        variant="outlined" :ripple="false" size="large">
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

.btn.bg-red {
    animation: blink 1s;
}
</style>


