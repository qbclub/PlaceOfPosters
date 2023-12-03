<script setup>

const router = useRouter();
const userStore = useAuth();
const user = ref(userStore.user);
let select = ref(router.currentRoute.value.path);
let snackbar = ref(false)
let snackbarText = ref('')

let buyDialog = ref(false);

let closeDialog = () => {
  buyDialog.value = false
}
let purchase = async () => {
  buyDialog.value = false
  await userStore.getSubscriptionCount(userStore.user._id)
  snackbarText.value = 'Афишы куплены'
  snackbar.value = true

}

watch(select, () => {
  navigateTo(select.value)
})
watch(router.currentRoute, () => {
  select.value = router.currentRoute.value.path
})
</script>
<template>
  <!-- <v-container> -->
  <div>
    <v-row>
      <v-col class="pb-0">
        <v-radio-group inline v-model="select" :hide-details="true">
          <v-radio label="Активные" value="/cabinet/posters/activeposters"></v-radio>
          <v-radio label="На модерации" value="/cabinet/posters/postersonmoderation"></v-radio>
          <v-radio label="Отказано" value="/cabinet/posters/rejected"></v-radio>
          <v-radio label="Архив" value="/cabinet/posters/archivedposters"></v-radio>
          <v-radio label="Черновики" value="/cabinet/posters/draftposters"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex flex-wrap align-center">
        <v-btn color="accent" variant="outlined" :ripple="false" to="/createposter" class="ma-1">
          Создать
        </v-btn>

        <v-btn color="accent" @click="buyDialog = true" class="ma-1" x>Купить
        </v-btn>
        <div class="ma-4">
          Остаток:
          <span class="text-accent">
            {{ userStore.user.subscription.count }}
          </span>
          шт.
        </div>

      </v-col>
    </v-row>
    <NuxtPage />

    <v-snackbar v-model="snackbar" color="success" timeout="2000">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn @click="snackbar = false" density="compact" icon="mdi-close"></v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="buyDialog" width="auto">
      <v-card class="pa-2">
        <v-card-title> Покупка </v-card-title>
        <Buy @closeDialog="closeDialog" @purchase="purchase" />
      </v-card>
    </v-dialog>
  </div>
  <!-- </v-container> -->
</template>
