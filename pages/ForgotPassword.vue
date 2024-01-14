<script setup>

import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { reactive } from "vue"
import { watch } from 'vue';
const route = useRoute();
const router = useRouter();
const userStore = useAuth();

const form = reactive({
  email: "",
  password: ""
})
let snackbar = ref(false)
async function forgotPassword() {
  await userStore.forgotPassword(form.email).then(() => { snackbar.value = true })
}

async function resetPassword() {
  let { query } = route

  await userStore.resetPassword(form.password, query.token, query.user_id);
  router.push("/cabinet");
}
watch(snackbar, ()=>{
  if(!snackbar.value) {
    router.push("/posters");
  }
})

</script>
<template>
  <div>
  <v-container>
    <v-responsive>
      <v-row class="d-flex justify-center pa-8">
        <v-col cols="12">
          <h2 class="text-center ">Смена пароля</h2>
        </v-col>

        <v-col cols="12" md="6" sm="8">
          <v-form @submit.prevent="forgotPassword" class="d-flex flex-column align-center justify-center w-100"
            v-if="!route.query.user_id && !route.query.token">
            <v-col>
              <v-text-field v-model="form.email" label="Введите почту" placeholder="email@gmail.com" class="w-100"
                density="compact" variant="outlined" hint="Ссылка для смены пароля придет на эту почту"></v-text-field>

            </v-col>
            <v-col class="d-flex justify-center">
              <v-btn class="ma-2 " color="accent" @click="forgotPassword">Отправить</v-btn>
            </v-col>
          </v-form>
          <v-form @submit.prevent="resetPassword" class="d-flex flex-column align-center justify-center w-100" v-else>
            <v-col>
              <v-text-field v-model="form.password" label="Новый пароль" placeholder="***********" type="password"
                class="w-100" density="compact" variant="outlined"></v-text-field>
            </v-col>
            <v-col class="d-flex justify-center">
              <v-btn class="ma-2" color="accent" @click="resetPassword">Отправить</v-btn>
            </v-col>
          </v-form>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
  <v-snackbar v-model="snackbar" color="success" :timeout="2000">
    письмо отправлено
    <template v-slot:actions>
      <v-btn @click="snackbar = false" density="compact" icon="mdi-close"></v-btn>
    </template>
  </v-snackbar>
</div>
</template>
<style lang="scss" scoped></style>
../stores/auth