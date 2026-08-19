<script setup>
let search = ref('')
let posters = ref([])

const postersStore = usePoster()

async function findPosters() {
    posters.value = await postersStore.loadPosters({
        $or: [
            { title: { $regex: search.value, $options: 'i' } },
            { description: { $regex: search.value, $options: 'i' } },
            { organizer: { $regex: search.value, $options: 'i' } },
        ]
    })
}
</script>

<template>
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
                :actions="['edit', 'delete', 'hide', 'set-first', 'remove-first']" @getPosters="findPosters" />

            <h3 class="text-center" v-else>
                Мы ничего не нашли 😟
            </h3>
        </v-col>
    </v-row>
</template>