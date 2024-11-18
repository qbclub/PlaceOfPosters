<script setup>

let authStore = useAuth()
</script>

<template>
  <v-bottom-navigation :elevation="0" density="comfortable" style="max-width:100vw;overflow-x: scroll;scrollbar-width: none;">
    <v-btn @click="navigateTo('/posters')" exact :ripple="false" class="pa-0 ml-4">
      <v-icon>mdi-post</v-icon>
      <span>Афиши</span>
    </v-btn>

    <v-btn @click="navigateTo('/info/landing')" exact :ripple="false" class="pa-0">
      <v-icon>mdi-information-variant</v-icon>
      <span>Инфо</span>
    </v-btn>

    <v-btn @click="navigateTo('/cabinet/me')" exact :ripple="false" class="pa-0">
      <v-icon>mdi-account</v-icon>
      <span>Кабинет</span>
    </v-btn>

    <v-btn to="/admin/moderation/onmoderation" exact :ripple="false" v-if="authStore.user?.roles.includes('admin')" class="pa-0">
      <v-icon>mdi-security</v-icon>
      <span>Админ</span>
    </v-btn>

    <v-btn to="/manager/moderation/onmoderation" exact :ripple="false" v-if="authStore.user?.managerIn?.length" class="pa-0 mr-4">
      <v-icon>mdi-account-group-outline</v-icon>
      <span>Менеджер</span>
    </v-btn>

  </v-bottom-navigation>
</template>

<style scoped lang="scss">
.v-btn {
  opacity: 0.8;
}
</style>