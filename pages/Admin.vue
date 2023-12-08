<script setup>
definePageMeta({
  middleware: ['is-admin']
})

import { getData, setData } from 'nuxt-storage/local-storage';


let tab = ref(getData('adminTab') ?? "/admin/moderation");

navigateTo(tab.value)

function setLocalStorage() {
  setData('adminTab', tab.value, 30, 'd')
}

watch(tab, () => {
  navigateTo(tab.value)
})
</script>
<template>
  <v-container>
    <h2>Админ кабинет</h2>
    <v-row>
      <v-col cols="12">
        <v-tabs class="d-flex" v-model="tab" @update:model-value="setLocalStorage">
          <v-tab value="/admin/moderation/onmoderation">Модерация</v-tab>
          <v-tab value="/admin/appsettings/interface">Настройки</v-tab>
          <v-tab value="/admin/getusers">Пользователи</v-tab>
          <v-tab value="/admin/ord">ОРД</v-tab>
        </v-tabs>
        <NuxtPage />
      </v-col>
    </v-row>
  </v-container>
</template>
