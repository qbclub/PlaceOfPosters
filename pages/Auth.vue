<script setup>
import { useField, useForm } from 'vee-validate'
import { useRouter } from 'vue-router'


let router = useRouter()

const userStore = useAuth()

const { handleSubmit, handleReset } = useForm({
    validationSchema: {
        password(value) {
            if (value?.length >= 6) return true

            return 'нужно 6 символов'
        },
        email(value) {
            if (/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm.test(value)) return true

            return 'неправильный формат email'
        },
    },
})
const email = useField('email')
const password = useField('password')

const login = handleSubmit(values => {
    userStore.login(values).then(() => router.push('/cabinet/me'))
})
</script>

<template>
    <v-container>
        <v-responsive>
            <v-row class="d-flex justify-center pa-8">
                <v-col cols="12">
                    <h2 class="text-center ">Вход</h2>
                </v-col>

                <v-col cols="12" md="6" sm="8">
                    <v-form @submit.prevent="login" class="d-flex flex-column align-center justify-center w-100">
                        <v-text-field v-model="email.value.value" :error-messages="email.errorMessage.value" label="E-mail"
                            class="w-100" density="compact" variant="outlined" autocomplete="off"></v-text-field>
                        <v-text-field v-model="password.value.value" :error-messages="password.errorMessage.value"
                            label="Пароль" type="password" class="w-100" density="compact" variant="outlined"
                            autocomplete="off"></v-text-field>
                        <v-btn class="mt-2" type="submit">
                            войти
                        </v-btn>

                        <div @click="router.push('/reg')"
                            class="text-caption pt-2 pr-2 pl-2 mt-2 w-100 text-center text-accent" style="cursor: pointer;">
                            регистрация</div>
                        <div @click="router.push('/forgot-password')"
                            class="text-caption pr-2 pb-2 pl-2 w-100 text-center text-accent" style="cursor: pointer;">
                            восстановить пароль</div>
                    </v-form>
                </v-col>
            </v-row>
        </v-responsive>
    </v-container>
</template>
