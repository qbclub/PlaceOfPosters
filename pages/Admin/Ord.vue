<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from "vue-router";

const router = useRouter();

let select = ref("/admin/ord");

watch(select, () => {
    router.push(select.value)
})
watch(router.currentRoute, () => {
    select.value = router.currentRoute.value.path
})

onMounted(() => {
    if (router.currentRoute.value.path != '/admin/ord')
        router.push('/admin/ord')
})
</script>
<template>
    <v-row>
        <v-col class="pb-0">
            <v-radio-group inline v-model="select" :hide-details="true">
                <v-radio label="Организация" value="/admin/ord"></v-radio>
                <v-radio label="Отчеты" value="/admin/ord/reports"></v-radio>

            </v-radio-group>
            <NuxtPage />
        </v-col>
    </v-row>
</template>