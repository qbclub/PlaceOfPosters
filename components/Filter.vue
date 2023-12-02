<script setup>

const appStateStore = useAppStore();
let posterStore = usePoster()
// let typeQuery = ref('')
let eventTypes = ref(appStateStore.appState.eventTypes)
let subcategories = ref([])

// let eventSubtypes = ref([])


let emit = defineEmits(['closeFilter'])

let filterForm = reactive({
    searchText: '',
    date: null,
    eventType: [],
    eventSubtype: []
})


// function setSubtypes(value) {
//     eventSubtypes.value = value ? appStateStore.appState.eventTypes.find(item => item.name === value).subcategories : []
// }

// setSubtypes()
let date_items = [
    'Сегодня',
    'На неделе',
    'Скоро',
]
let selectedTypeIndex = ref(null)
let selectedSubcategoryIndex = ref(null)
let selectedDayIndex = ref(null)



async function submit() {
    filterForm.searchText = filterForm.searchText
    posterStore.posters = []
    posterStore.page = 1
    await posterStore.fetchPosters(filterForm)
    emit('closeFilter')
}

async function resetForm() {
    filterForm.searchText = '';
    filterForm.date = '';
    filterForm.eventType = [];
    filterForm.eventSubtype = []
    localStorage.setItem('filterForm', JSON.stringify(filterForm))
    localStorage.setItem('selectedDayIndex', null)
    localStorage.setItem('selectedTypeIndex', null)
    localStorage.setItem('selectedSubcategoryIndex', null)
    posterStore.posters = []
    posterStore.page = 1
    await posterStore.fetchPosters(filterForm)
    emit('closeFilter')
}

// function updateSubcategories() {
//     subcategories.value = []
//     appStateStore.appState.eventTypes.filter(category => filterForm.eventType.includes(category.name)).map(category => subcategories.value = [...subcategories.value, ...category.subcategories])
// }

// watch(filterForm, () => {
//     localStorage.setItem('filterForm', JSON.stringify(filterForm))
// })
// // watch(() => filterForm.eventType, (value) => { setSubtypes(value); })
// watch(selectedDayIndex, () => {
//     filterForm.date = date_items[selectedDayIndex.value]
//     localStorage.setItem('selectedDayIndex', selectedDayIndex.value)
// })
// watch(selectedTypeIndex, () => {
//     filterForm.eventType = selectedTypeIndex.value.map((value) => { return eventTypes.value[value].name })
//     updateSubcategories()

//     localStorage.setItem('selectedTypeIndex', JSON.stringify(selectedTypeIndex.value))
// })
// watch(selectedSubcategoryIndex, () => {
//     filterForm.eventSubtype = selectedSubcategoryIndex.value.map((value) => { return subcategories.value[value] })
    
//     localStorage.setItem('selectedSubcategoryIndex', JSON.stringify(selectedSubcategoryIndex.value))
// })

onMounted(async () => {
    // if (localStorage.getItem('filterForm')) {
    //     let filter = JSON.parse(localStorage.getItem('filterForm'))
    //     filterForm.searchText = filter.searchText;
    //     filterForm.date = filter.date;
    //     filterForm.eventType = filter.eventType;
    //     filterForm.eventSubtype = filter.eventSubtype
    // }


    // if (localStorage.getItem('selectedDayIndex')) {
    //     selectedDayIndex.value = localStorage.getItem('selectedDayIndex')
    //     filterForm.date = date_items[selectedDayIndex.value]
    // }
    // if (localStorage.getItem('selectedTypeIndex')) {
    //     selectedTypeIndex.value = JSON.parse(localStorage.getItem('selectedTypeIndex'))
    //     filterForm.eventType = eventTypes.value[selectedTypeIndex.value]?.name
    //     updateSubcategories()
    // }
    // if (localStorage.getItem('selectedSubcategoryIndex')) {
    //     selectedSubcategoryIndex.value = JSON.parse(localStorage.getItem('selectedSubcategoryIndex'))
    //     filterForm.eventSubtype = subcategories.value[selectedSubcategoryIndex.value]?.name
    // }
})
</script>

<template>
    <v-form ref="form">
        <v-row class="justify-center">
            <v-col cols="12" sm="6">
                <v-text-field v-model="filterForm.searchText" variant="outlined" density="compact" label="Поиск"
                    hide-details></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" class="d-flex justify-space-evenly">
                <v-chip-group filter v-model="selectedDayIndex">
                    <v-chip filter variant="outlined" v-for="item, index in date_items">
                        {{ item }}
                    </v-chip>
                </v-chip-group>
            </v-col>
            <v-col cols="12" style="max-height: 30dvh;  overflow-y:auto">
                <v-chip-group filter multiple v-model="selectedTypeIndex">
                    <v-chip filter variant="outlined" v-for="type, index in eventTypes">
                        {{ type.name }}
                    </v-chip>
                </v-chip-group>
            </v-col>
            <v-col cols="12" style="max-height: 30dvh;  overflow-y:auto">
                <v-chip-group filter multiple v-model="selectedSubcategoryIndex">
                    <v-chip filter variant="outlined" v-for="type, index in subcategories">
                        {{ type }}
                    </v-chip>
                </v-chip-group>
            </v-col>
            <v-col cols="12" sm="6" class="d-flex justify-space-around">
                <v-btn color="accent" @click="submit()" :flat="true">Найти</v-btn>
                <v-btn @click="resetForm()" :flat="true">Очистить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>
<style lang="scss" scoped>
.active {
    background: #ED413E;
    color: white;
}
</style>