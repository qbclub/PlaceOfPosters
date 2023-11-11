<script setup>
import { onMounted, ref, watch } from "vue"
import { useRouter } from "vue-router"

let router = useRouter()

let select = ref('/admin/app-settings/interface')
let routeTo = () => {
    router.push(select.value)
}
watch(select, () => {
    routeTo()
})

onMounted(() => {
    if (router.currentRoute.value.path != '/admin/app-settings/interface')
        router.push('/admin/app-settings/interface')
})
</script>

<template>
    <v-container>
        <v-radio-group inline v-model="select">
            <v-radio label="Интерфейс" value="/admin/app-settings/interface"></v-radio>
            <v-radio label="Управление" value="/admin/app-settings/management"></v-radio>
        </v-radio-group>
        <NuxtPage />

    </v-container>
</template>