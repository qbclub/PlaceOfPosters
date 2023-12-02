<script setup>

import { useRouter } from 'vue-router'
import BackButton from '../components/BackButton.vue'
import dates from "@/plugins/dates"
let router = useRouter()
let poster = ref({})
let preview = ref()

onMounted(() => {
    if (localStorage.getItem('createPosterForm')) {
        poster.value = JSON.parse(localStorage.getItem('createPosterForm'))
    }
    if (localStorage.getItem('posterFormImage')) {
        preview.value = localStorage.getItem('posterFormImage')

    }

})
</script>
<template>
    <v-container>
        <v-responsive>
            <v-row>
                <v-col>
                    <BackButton />
                </v-col>

            </v-row>
            <v-row v-if="poster" class="pb-4">
                <v-col cols="12" md="6">
                    <div class="posterView" @click="router.back()">
                        <v-img :src="preview" class="front">

                        </v-img>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="posterView">
                        <div class="text-center text-lowercase">{{ poster.eventType?  poster?.eventType.join(' | '): '' }}</div>
                        <!-- <div class="text-center text-lowercase">{{ poster?.eventSubtype.join(', ') }}</div> -->
                        <div class="text-center font-weight-bold">{{ poster.title }}</div>

                        <v-divider class="md-4"></v-divider>
                        <div v-html="poster.description"></div>
                        <v-divider class="md-4"></v-divider>
                        <div> <b>Организатор:</b> {{ poster.organizer }}</div>
                        <div v-if="poster.date" class="d-flex">
                            <div><b>Время начала:&nbsp;</b></div>
                            <div>
                                <div v-for="eventDate in poster.date">
                                    {{ dates.dateWithTime(eventDate) }}
                                </div>
                            </div>
                        </div>
                        <div v-else-if="poster.workingTime"> <b>Режим работы:</b> {{ poster.workingTime }}</div>
                        <div> {{ poster.workingTime }}</div>
                        <div> <b>Email:</b> {{ poster.email }}</div>
                        <div> <b> Сайт:</b> {{ poster.site }}</div>
                        <div> <b>Телефон:</b> {{ poster.phone }}</div>
                    </div>
                </v-col>
            </v-row>
        </v-responsive>
    </v-container>
</template>
<style scoped>
.posterView {
    height: 80dvh;
}
</style>~/PLUGINS_TEMP/dates