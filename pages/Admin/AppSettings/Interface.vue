<script setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useAuth } from "@/store/auth";
import { useAppStore } from "@/store/app";

let authStore = useAuth()
let router = useRouter()
const appStateStore = useAppStore()

let newEventType = ref('')

let selectedEventType = ref(null)
let newEventSubtype = ref('')

async function logout() {
    await authStore.logout()
    router.push('/posters')
}
async function addEventType() {
    await appStateStore.addEventType(newEventType.value)
    newEventType.value = ''
}

async function addEventSubtype() {
    await appStateStore.addEventSubtype(selectedEventType.value.name, newEventSubtype.value)
    selectedEventType.value = null
    newEventSubtype.value = ''
}

function deleteEventType(eventType) {
    appStateStore.deleteEventType(eventType)
}

function deleteEventSubtype(eventType, eventSubtype) {
    appStateStore.deleteEventSubtype(eventType, eventSubtype)
}

onMounted(async () => {
    await appStateStore.getAppState()
})
</script>

<template>
    <v-container class="pa-0">
        <v-row class="pa-0 justify-center mb-16">
            <v-col cols="12" sm="8" md="6" class="pa-0">
                <div class="w-100 text-center text-h6">Категории</div>

                <v-list lines="one">
                    <v-list-group v-for="eventType, index of appStateStore.appState.eventTypes" :key="index"
                        :value="eventType.name">
                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props" class="pa-0">
                                <v-btn @click="deleteEventType(eventType.name)" :ripple="false" class="pa-0 elevation-0"
                                    icon="mdi-delete" size="small"></v-btn>

                                {{ eventType.name }}
                            </v-list-item>
                        </template>

                        <v-list-item v-for="eventSubtype, subcategory_index of eventType.subcategories"
                            class="align-center">
                            <v-btn @click="deleteEventSubtype(eventType.name, eventSubtype)" :ripple="false"
                                class="pa-0 elevation-0" icon="mdi-delete" size="small"></v-btn>

                            {{ eventSubtype }}
                        </v-list-item>

                        <v-menu :close-on-content-click="false">
                            <template v-slot:activator="{ props }">
                                <v-list-item v-bind="props" prepend-icon="mdi-plus">
                                    Создать подкатегорию
                                </v-list-item>
                            </template>

                            <v-col cols="12" md="6">
                                <v-card class="pa-4">
                                    <v-text-field v-model="newEventSubtype" append-inner-icon="mdi-send" variant="outlined"
                                        density="compact" hide-details
                                        @click:append-inner="selectedEventType = eventType; addEventSubtype()" />
                                </v-card>
                            </v-col>
                        </v-menu>
                    </v-list-group>

                    <v-menu :close-on-content-click="false">
                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props" prepend-icon="mdi-plus">
                                Создать категорию
                            </v-list-item>
                        </template>

                        <v-col cols="12" md="6">
                            <v-card class="pa-4">
                                <v-text-field v-model="newEventType" variant="outlined" density="compact" hide-details
                                    append-inner-icon="mdi-send" @click:append-inner="addEventType" />
                            </v-card>
                        </v-col>
                    </v-menu>
                </v-list>
            </v-col>
        </v-row>
    </v-container>
</template>~/stores/auth~/stores/app