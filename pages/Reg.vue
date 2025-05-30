<script setup>
import { useField, useForm } from 'vee-validate'
import { useRouter } from 'vue-router'


let router = useRouter()

const authStore = useAuth()

const { meta, handleSubmit, handleReset } = useForm({
	validationSchema: {
		email(value) {
			if (/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm.test(value)) return true

			return 'неправильный формат'
		},
		firstname(value) {
			if (value?.length >= 2) return true

			return 'нужно 2 символа'
		},
		lastname(value) {
			if (value?.length >= 2) return true

			return 'нужно 2 символа'
		},
		phone(value) {
			if (value?.length > 9 && /[0-9-]+/.test(value)) return true

			return 'неправильный формат'
		},
		password(value) {
			if (value?.length >= 6) return true

			return 'нужно 6 символов'
		},
		agreement(value) {
			if (value) return true

			return 'подтвердите согласие на обработку'
		},
	},
})
const agreement = useField('agreement')
const email = useField('email')
const firstname = useField('firstname')
const lastname = useField('lastname')
const phone = useField('phone')
const password = useField('password')

const register = handleSubmit(async (values) => {
	await authStore.registration(values).then(() => navigateTo('/posters'))
})
</script>
<template>
	<v-container>
		<v-responsive>
			<v-row class="d-flex justify-center pa-8">
				<v-col cols="12">
					<h2 class="text-center ">Регистрация</h2>
				</v-col>

				<v-col cols="12" md="6" sm="8">
					<v-form @submit.prevent="register" class="d-flex flex-column align-center justify-center w-100">
						<v-text-field v-model="email.value.value" :error-messages="email.errorMessage.value"
							placeholder="johndoe@gmail.com" label="Почта" class="w-100" density="compact"
							variant="outlined" />
						<v-text-field v-model="firstname.value.value" :error-messages="firstname.errorMessage.value"
							label="Имя" class="w-100" density="compact" variant="outlined" />
						<v-text-field v-model="lastname.value.value" :error-messages="lastname.errorMessage.value"
							label="Фамилия" class="w-100" density="compact" variant="outlined" />
						<v-text-field v-model="phone.value.value" :error-messages="phone.errorMessage.value"
							label="Номер телефона" class="w-100" density="compact" variant="outlined"
							autocomplete="off" />
						<v-text-field v-model="password.value.value" :error-messages="password.errorMessage.value"
							label="Пароль" type="password" class="w-100" density="compact" variant="outlined"
							autocomplete="off" />
						<v-row class="d-flex ">
							<v-col cols="4">
								<v-checkbox v-model="agreement.value.value"
									:error-messages="agreement.errorMessage.value" class="mr-4">

								</v-checkbox>
							</v-col>
							<v-col>
								Я даю согласие на обработку персональных данных согласно <a
									href="https://storage.yandexcloud.net/politica/Politica%20confidetcionalnosty.pdf"
									target="_blank"><b>ПРАВИЛ</b></a>
							</v-col>

						</v-row>
						<div class="d-flex"><v-btn type="submit" block :disabled="!meta.valid"
								class="mt-2">отправить</v-btn></div>

					</v-form>

					<div @click="router.push('/auth')" class="text-caption pa-2 mt-2 w-100 text-center text-accent"
						style="cursor: pointer;">вход</div>
				</v-col>
			</v-row>
		</v-responsive>
	</v-container>
</template>
../stores/auth