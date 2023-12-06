<script setup>


const router = useRouter();

let select = ref("/admin/ord/ordorganisation");

watch(select, () => {
    navigateTo(select.value)
})
watch(router.currentRoute, () => {
    select.value = router.currentRoute.value.path
})

onMounted(() => {
    if (router.currentRoute.value.path != '/admin/ord/ordorganisation')
        navigateTo('/admin/ord/ordorganisation')
})
</script>
<template>
    <v-row>
        <v-col class="pb-0">
            <v-radio-group inline v-model="select" :hide-details="true">
                <v-radio label="Организация" value="/admin/ord/ordorganisation"></v-radio>
                <v-radio label="Отчеты" value="/admin/ord/reports"></v-radio>

            </v-radio-group>
            <NuxtPage />
        </v-col>
    </v-row>
</template>