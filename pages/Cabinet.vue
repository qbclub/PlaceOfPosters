<script setup>
definePageMeta({
    middleware: ['is-auth']
})

let tab = ref("/cabinet/me");

let authStore = useAuth();
let priceStore = usePrice()

async function logout() {
    await authStore.logout();
    navigateTo("/posters");
}

watch(tab, (newValue) => {
    navigateTo(newValue)
})
let routes = ["/cabinet/me", "/cabinet/contract", "/cabinet/posters", "/cabinet/eventlog"]
onMounted(async () => {
    if (!routes.includes(useRoute().path)) {
        navigateTo('/cabinet/me')
    }
    if (!priceStore.prices.length) {
        await priceStore.fetchPrices()
    }
})
</script>
<template>
    <v-container>
        <v-row>
            <v-col>
                <h2>Кабинет</h2>
            </v-col>
            <v-col @click="logout" style="cursor: pointer" cols="auto" class="d-flex flex-row">
                <v-icon>mdi-logout</v-icon>
                <div class="ml-1">выйти</div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-tabs model-value="tab" :mandatory="true">
                    <v-tab :ripple="false" :value="routes[0]" :to="routes[0]"> О вас </v-tab>
                    <v-tab :ripple="false" :value="routes[1]" :to="routes[1]"> Договоры </v-tab>
                    <v-tab :ripple="false" :value="routes[2]" :to="routes[2]"> Афиши </v-tab>
                    <v-tab :ripple="false" :value="routes[3]" :to="routes[3]"> Оплаты </v-tab>
                </v-tabs>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <ClientOnly>
                    <NuxtPage />
                </ClientOnly>
            </v-col>
        </v-row>
    </v-container>
</template>
