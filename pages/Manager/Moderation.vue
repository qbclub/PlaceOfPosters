<script setup>
let select = ref('/manager/moderation/onmoderation')

watch(select, () => {
    navigateTo(select.value)
})

onMounted(async () => {
    // postersOnModeration.value = await posterStore.getPostersOnModeraion()
})
</script>

<template>
    <v-container>
        <v-radio-group inline v-model="select">
            <v-radio label="На модерации" value="/manager/moderation/onmoderation"></v-radio>
            <v-radio label="Отказано" value="/manager/moderation/rejected"></v-radio>
        </v-radio-group>

        <NuxtPage />
    </v-container>
</template>
<style scoped lang="scss">
.button {
    border-radius: 12px;
}
</style>