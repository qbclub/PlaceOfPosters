<script setup>
import SettingInput from '@/components/Input/SettingInput.vue'
import { useField, useForm } from 'vee-validate'

let authStore = useAuth()
let router = useRouter()

let breadcrumbs = [
  {
    title: 'Кабинет',
    disabled: false,
    exact: true,
    link: true,
    to: { path: '/cabinet' },
  },
  {
    title: 'Редактировать аккаунт',
    disabled: true,
    exact: true,
    link: true,
    to: { path: '/Cabinet/editAccount' }
  },
]

async function logout() {
  await authStore.logout()
  router.push('/posters')
}

let user = authStore.user
console.log(user)

let { meta, handleSubmit } = useForm({
  initialValues: {
    firstname: user.firstname,
    lastname: user.lastname,
    surname: '',
    town: '',
    birthday: ''
  },
  validationSchema: {
    firstname(value) {
      value = value?.trim()
      if (value.length === 0) return 'введите имя'
      if (value.length < 2) return 'короткое имя'
      if (!/^[A-Za-zА-Яа-я]*$/.test(value)) return 'это не имя'

      return true
    },
    lastname(value) {
      value = value?.trim()
      if (value.length === 0) return 'введите фамилию'
      if (value.length < 2) return 'короткая фамилия'
      if (!/^[A-Za-zА-Яа-я]*$/.test(value)) return 'это не фамилия'

      return true
    },
    surname(value) {
      value = value?.trim()
      if (value.length === 2) return 'введите отчество'
      if (value.length < 2) return 'короткое отчество'
      if (!/^[A-Za-zА-Яа-я]*$/.test(value)) return 'это не отчество'

      return true
    },
    town(value) {
      if (value.length === 0) return 'введите город'

      return true
    },
    birthday(value) {
      return true
    }
  }
})

let firstname = useField('firstname')
let lastname = useField('lastname')
let surname = useField('surname')
let town = useField('town')
let birthday = useField('birthday')

const submit = handleSubmit(async values => {

})
</script>

<template>
  <v-container>
    <v-row class="ma-0 pa-0 flex-row justify-space-between align-center w-100">
      <div>
        <v-breadcrumbs :items="breadcrumbs" />
      </div>

      <div @click="logout" class="pa-2 align-center cursor-pointer">
        <!-- <v-icon>mdi-logout</v-icon> -->
        <span class="mdi mdi-logout"></span> выйти
      </div>
    </v-row>

    <v-form @submit.prevent="submit">
      <h3>Личные данные</h3>

      <v-row class="mt-2 flex-column" style="width: 80%;">
        <v-row class="flex-row justify-space-between">
          <v-col cols="6" class="pa-6">
            <SettingInput v-model="firstname.value.value" :error-messages="firstname.errorMessage.value"
              placeholder="Иван" first>
              Имя:
            </SettingInput>
          </v-col>

          <v-col cols="6" class="pa-6">
            <SettingInput v-model="lastname.value.value" :error-messages="lastname.errorMessage.value"
              placeholder="Чукавин">
              Фамилия:
            </SettingInput>
          </v-col>
        </v-row>
        <v-row class="flex-row">
          <v-col cols="6" class="pa-6">
            <SettingInput v-model="surname.value.value" :error-messages="surname.errorMessage.value" placeholder="Чеевич"
              first>
              Отчество:
            </SettingInput>
          </v-col>

          <v-col cols="6" class="pa-6">
            <SettingInput v-model="town.value.value" :error-messages="town.errorMessage.value" placeholder="Глазов"
              insert-dadata>
              Город:
            </SettingInput>
          </v-col>
        </v-row>
      </v-row>

      <h3>Вход и безопасность</h3>

      <v-btn type="submit" :disabled="!meta.valid">
        Сохранить
      </v-btn>
    </v-form>
  </v-container>
</template>