<script setup>
definePageMeta({
  middleware: ['is-admin']
})

let tab = ref("/admin/moderation");

watch(tab, () => {
  navigateTo(tab.value)
})
</script>
<template>
  <v-container>
    <h2>Админ кабинет</h2>
    <v-row>
      <v-col cols="12">
        <v-tabs class="d-flex" v-model="tab">
          <v-tab value="/admin/moderation/onmoderation">Модерация</v-tab>
          <v-tab value="/admin/appsettings/interface">Настройки</v-tab>
          <v-tab value="/admin/getusers">Пользователи</v-tab>
          <v-tab value="/admin/ord">ОРД</v-tab>
          <v-tab value="/admin/toemail">Рассылка</v-tab>
        </v-tabs>
        <NuxtPage />
      </v-col>
    </v-row>
  </v-container>
</template>
