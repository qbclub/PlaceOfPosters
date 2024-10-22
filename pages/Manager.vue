<script setup>
definePageMeta({
  middleware: ['is-manager']
})

let tab = ref("/manager/moderation");

watch(tab, () => {
  navigateTo(tab.value)
})
</script>
<template>
  <v-container>
    <h2>Кабинет менеджера</h2>
    <v-row>
      <v-col cols="12">
        <v-tabs class="d-flex" v-model="tab">
          <v-tab value="/manager/moderation/onmoderation">Модерация</v-tab>
          <v-tab value="/manager/posters">Афиши</v-tab>
        </v-tabs>
        <NuxtPage />
      </v-col>
    </v-row>
  </v-container>
</template>