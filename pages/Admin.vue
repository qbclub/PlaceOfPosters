<script setup>

import { useRouter } from "vue-router";

let router = useRouter();

let tab = ref(localStorage.getItem('adminTab') ?? "/admin/moderation");

router.push(tab.value)

function setLocalStorage() {
  localStorage.setItem('adminTab', tab.value)
}

watch(tab, () => {
  router.push(tab.value)
})
</script>
<template>
  <v-container>
    <h2>Админ кабинет</h2>
    <v-row>
      <v-col cols="12">
        <v-tabs class="d-flex" v-model="tab" @update:model-value="setLocalStorage">
          <v-tab value="/admin/moderation/on-moderation">Модерация</v-tab>
          <v-tab value="/admin/app-settings/interface">Настройки</v-tab>
          <v-tab value="/admin/get-users">Пользователи</v-tab>
          <v-tab value="/admin/ord">ОРД</v-tab>
        </v-tabs>
        <router-view />
      </v-col>
    </v-row>
  </v-container>
</template>
