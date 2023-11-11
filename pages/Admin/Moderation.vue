<script setup>
import { onMounted, ref, watch } from "vue";
import router from "@/router";

let select = ref('/admin/moderation/on-moderation')

watch(select, () => {
    router.push(select.value)
})

onMounted(async () => {
    // postersOnModeration.value = await posterStore.getPostersOnModeraion()
})
</script>

<template>
    <v-container>
        <v-radio-group inline v-model="select">
            <v-radio label="На модерации" value="/admin/moderation/on-moderation"></v-radio>
            <v-radio label="Отказано" value="/admin/moderation/rejected"></v-radio>
        </v-radio-group>

        <NuxtPage />
    </v-container>
</template>
<style scoped lang="scss">
.button {
    border-radius: 12px;
}
</style>