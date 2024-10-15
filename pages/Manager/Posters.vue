<script setup>
let search = ref('')
let posters = ref([])

const postersStore = usePoster()
let userStore = useAuth()
let cities = ref([]);
let areas = ref([]);
let regions = ref([]);

async function findPosters() {
    posters.value = await postersStore.loadPosters({
        $and: [
            {
                $or: [
                    { title: { $regex: search.value, $options: 'i' } },
                    { description: { $regex: search.value, $options: 'i' } },
                    { organizer: { $regex: search.value, $options: 'i' } },
                ]
            },
            {
                $or: [{
                    "eventLocation.city_with_type": {
                        $in: cities.value
                    }
                },
                {
                    "eventLocation.area_with_type": {
                        $in: areas.value
                    }
                },
                {
                    "eventLocation.region_with_type": {
                        $in: regions.value
                    }
                },
                ]
            }
        ],
    })
}
onMounted(async () => {
    for (let loc of userStore?.user?.managerIn) {
        if (loc.type == "city_with_type") { cities.value.push(loc.name) }
        if (loc.type == "area_with_type") { areas.value.push(loc.name) }
        if (loc.type == "region_with_type") { regions.value.push(loc.name) }
    }
}
)
</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-row class="mb-4">
                    <v-col class="pa-0" cols="8" md="5">
                        <v-text-field :hide-details="true" v-model="search" variant="outlined"
                            placeholder="Название, описание, организатор" />
                    </v-col>
                    <v-col class="pa-0 d-flex align-center pl-2">
                        <v-btn color="accent" :flat="true" @click="findPosters">найти</v-btn>
                    </v-col>
                </v-row>

                <PostersList v-if="posters.length" :posters="posters" :isAdminPage="true" posterType="active"
                    :actions="['edit', 'delete', 'hide']" @getPosters="findPosters" />

                <h3 class="text-center" v-else>
                    Мы ничего не нашли 😟
                </h3>
            </v-col>
        </v-row>
    </v-container>
</template>