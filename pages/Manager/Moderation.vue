<script setup>
let userStore = useAuth()
let select = ref('/manager/moderation/onmoderation')
let cities = ref([]);
let areas = ref([]);
let regions = ref([]);

watch(select, () => {
    navigateTo(select.value)
})

onMounted(async () => {
    // postersOnModeration.value = await posterStore.getPostersOnModeraion()
    for (let loc of userStore?.user?.managerIn) {
        if (loc.type == "city_with_type") { cities.value.push(loc.name) }
        if (loc.type == "area_with_type") { areas.value.push(loc.name) }
        if (loc.type == "region_with_type") { regions.value.push(loc.name) }
    }
})
</script>

<template>
    <v-container>
        <v-row align="center">
            <v-col cols=6>
                <v-radio-group inline v-model="select">
                    <v-radio label="На модерации" value="/manager/moderation/onmoderation"></v-radio>
                    <v-radio label="Отказано" value="/manager/moderation/rejected"></v-radio>
                </v-radio-group>
            </v-col>
            <v-col cols=6 class="d-flex flex-column">
                <h4 v-if="cities.length"><span> Постеры из городов: </span><span v-for="city in cities">{{ city
                        }}</span></h4>
                <h4 v-if="areas.length"><span>Постеры из районов:</span> <span v-for="area in areas">{{ area }}</span>
                </h4>
                <h4 v-if="regions.length"><span>Постеры из регионов:</span> <span v-for="region in regions">{{ region
                        }}</span></h4>
            </v-col>
        </v-row>

        <NuxtPage />
    </v-container>
</template>
<style scoped lang="scss">
.button {
    border-radius: 12px;
}
</style>