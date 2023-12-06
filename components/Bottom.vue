<script setup>

let authStore = useAuth()
</script>

<template>
  <v-bottom-navigation :elevation="0">
    <v-btn  @click="navigateTo('/posters')" exact :ripple="false">
      <v-icon>mdi-post</v-icon>
      <span>Афиши</span>
    </v-btn>

    <v-btn  @click="navigateTo('/info/landing')" exact :ripple="false">
      <v-icon>mdi-information-variant</v-icon>
      <span>Инфо</span>
    </v-btn>

    <v-btn @click="navigateTo('/cabinet/me')" exact :ripple="false">
      <v-icon>mdi-account</v-icon>
      <span>Кабинет</span>
    </v-btn>

    <!-- <v-btn to="/admin/moderation/on-moderation" exact :ripple="false" v-if="authStore.user?.roles.includes('admin')">
      <v-icon>mdi-security</v-icon>
      <span>Админ</span>
    </v-btn> -->
  </v-bottom-navigation>
</template>

<style scoped lang="scss">
.v-btn {
  opacity: 0.8;
}
</style>