<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs';

const props = defineProps(['isStartPage'])
let emit = defineEmits(['closeDialog'])



let router = useRouter()
let appState = await getAppState()
let locationStore = useLocations()
let posterStore = usePoster()

let locations = await getEventLocations()
let categories = appState.eventTypes
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
    eventSubtype: []
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
function clearFilter() {
    selectedLocation.value = ''
    localStorage.setItem('location', selectedLocation.value)
    locationStore.location = selectedLocation.value

    filter.value = {
        searchText: '',
        date: '',
        eventType: [],
        eventSubtype: []
    }
    localStorage.setItem('filterForm', JSON.stringify(filter.value))
    posterStore.filter = filter.value
}

function selectLocation(index) {
    if (selectedLocation.value == locations[index].name) {
        locationStore.location = ''
    } else {
        locationStore.location = locations[index].name
    }
    localStorage.setItem('location', selectedLocation.value)
}
function selectCategory(index) {
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

let isSelectedLocation = (name) => {
    if (selectedLocation.value == name) {
        return true
    } else {
        return false
    }
}



let isSelectedCategory = (name) => {

    if (filter.value.eventType) {
        return filter.value?.eventType.includes(name) ? true : false
    } else {
        return false
    }

}
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

</script>

<template>
    <v-container>
        <v-row class="flex-column justify-center align-center">
            <v-col v-if="isStartPage" cols="auto" class="pb-0">
                <h2> Настрой для себя</h2>
            </v-col>
            <v-col v-if="!isStartPage" cols="12" sm="6">
                <v-text-field v-model="filter.searchText" variant="outlined" density="compact" label="Поиск" hide-details
                    clearable></v-text-field>
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


            <v-col cols="12" class="d-flex justify-center flex-wrap" style="gap: 5px;">
                <v-btn v-for="category, index in categories" @click="selectCategory(index)"
                    :class="isSelectedCategory(category.name) ? 'bg-red' : ''" class="rounded-pill btn" :ripple="false"
                    style="animation: blink;" :size="useDisplay().mdAndUp.value ? undefined : 'small'" variant="flat">
                    {{ category.name }}
                </v-btn>
            </v-col>

            <v-col cols="12" class="d-flex justify-space-around flex-wrap mb-16">
                <v-btn @click="isStartPage ? router.push('/posters') : closeDialog()" class="rounded-lg text-accent"
                    variant="outlined" :ripple="false" size="large">
                    Показать афиши
                </v-btn>

                <!-- <v-btn v-if="!isStartPage" @click="clearFilter()" class="rounded-lg text-accent" variant="outlined" :ripple="false"
                    size="large">
                    Очистить фильтр
                </v-btn> -->
            </v-col>
        </v-row>
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


