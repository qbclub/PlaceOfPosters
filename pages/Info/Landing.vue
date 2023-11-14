<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from "vue-router";
import { usePrice } from '~/store/price';
import { useAuth } from "~/store/auth";




const userStore = useAuth();
let router = useRouter();
// let priceStore = usePrice()

// let prices = ref()
let isBuyDialog = ref(false);
let snackbar = ref(false)
let snackbarText = ref('')
let selectPrice = reactive({})
let price = reactive({

    name: "1 афиша",
    promoName: "Стандарт",
    price: 0,
    numberPosters: 1

})
let prices = reactive([{

    name: "1 афиша",
    promoName: "Стандарт",
    price: 150,
    numberPosters: 1

},
{
    name: "10 афиш",
    promoName: "Оптима",
    price: 1275,
    numberPosters: 10,

    profit: 15
},
{

    name: "50 афиш",
    promoName: "Мастер",
    price: 5250,
    numberPosters: 50,

    profit: 30
},
{

    name: "100 афиш",
    promoName: "Профи",
    price: 7500,
    numberPosters: 100,

    profit: 50
}])

let closeDialog = () => {
    isBuyDialog.value = false
    selectPrice = {}
}
let purchase = async () => {
    isBuyDialog.value = false
    await userStore.getSubscriptionCount(userStore.user._id)
    selectPrice = {}
    snackbarText.value = 'Афишы куплены'
    snackbar.value = true
}
let buyDialog = (price) => {
    selectPrice = price
    isBuyDialog.value = true

}

let checkIsAuth = () => {
    if (userStore.isAuth) {
        buyDialog(price)
    } else {
        router.push('/auth')
    }

}

onMounted(async () => {
    // if (!priceStore.prices.length) {
    //     await priceStore.fetchPrices()

    // }
    // prices.value = priceStore.prices
})

</script>
<template>
    <div>
        <v-row class="pb-16">
            <v-col cols="12">
                <p class="text-center mb-0 text-caption mt-1" style="color:#ED413E">Внимание!
                    Приложение
                    работает в тестовом режиме.</p>
            </v-col>

            <v-col cols="12" sm="6">
                <v-hover v-slot="{ isHovering, props }">
                    <v-card userStore. @click="checkIsAuth()" height="100" v-bind="props" color="success"
                        class="animation mx-auto rounded pa-4 d-flex flex-column justify-space-between">
                        <div class=" text-h6 text-md-h5">Тестовый режим до 31.12.2023</div>
                        <div class=" text-h6 text-md-h5 text-end font-weight-bold"> Aфиша - 0 рублей </div>
                    </v-card>
                </v-hover>
            </v-col>

            <v-col v-for="price in prices" cols="12" sm="6">
                <v-hover v-slot="{ isHovering, props }">
                    <!-- @click="buyDialog(price)" -->
                    <v-card height="100" v-bind="props"
                        class="animation mx-auto rounded pa-4 d-flex flex-column justify-space-between">
                        <div class="text-end text-h6 font-italic">&laquo;{{ price.promoName }}&raquo;</div>
                        <div class=" text-h6 text-md-h5 font-weight-bold"> {{ price.name
                        }} </div>

                        <p v-if="price.profit">
                            <span class="discont">
                                Скидка {{ price.profit }}%
                            </span>
                            Экономия {{ price.numberPosters * 150 - price.price }} руб
                        </p>
                        <p class="text-end text-h6 font-weight-bold"> Цена: {{ price.price }} руб
                        </p>
                    </v-card>
                </v-hover>

            </v-col>
            <v-col cols="12" sm="6">
                <v-hover v-slot="{ isHovering, props }">
                    <v-card v-bind="props" color="accent"
                        class="animation rounded pa-4 d-flex flex-column justify-space-between">

                        <ul class="pl-4">
                            <li>
                                <div class=" text-h6 text-md-h5"> Гранты на бесплатное размещение </div>

                            </li>
                            <li>
                                <div class=" text-h6 text-md-h5"> Особые условия рекламным агентствам</div>
                            </li>
                        </ul>

                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
        <v-dialog v-model="isBuyDialog" width="auto">

            <v-card class="pa-2">

                <v-card-title> Покупка </v-card-title>
                <Buy @closeDialog="closeDialog" @purchase="purchase" :selectPrice="selectPrice" />
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" color="success" timeout="2000">
            {{ snackbarText }}
            <template v-slot:actions>
                <v-btn @click="snackbar = false" density="compact" icon="mdi-close"></v-btn>
            </template>
        </v-snackbar>
    </div>
</template>
<style scoped lang="scss">
.v-card {
    height: 100% !important;
}

.discont {
    position: fixed;
    top: 16px;
    left: 10px;
    transform: rotate(-15deg);
    color: #ED413E;
}

.animation:not(:hover) {
    transform: scale(1);
    transition: all 0.5s;
}

.animation:hover {
    transform: scale(1.03);
    transition: all 0.5s;
}
</style>