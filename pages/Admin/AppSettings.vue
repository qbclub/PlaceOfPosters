<script setup>

let router = useRouter()

let select = ref('/admin/appsettings/interface')
let routeTo = () => {
    navigateTo(select.value)
}
watch(select, () => {
    navigateTo(select.value)
})

onMounted(() => {
    if (router.currentRoute.value.path != '/admin/appsettings/interface')
        navigateTo('/admin/appsettings/interface')
})
</script>

<template>
    <v-container>
        <v-radio-group inline v-model="select">
            <v-radio label="Интерфейс" value="/admin/appsettings/interface"></v-radio>
            <v-radio label="Управление" value="/admin/appsettings/management"></v-radio>
        </v-radio-group>
        <NuxtPage />

    </v-container>
</template>