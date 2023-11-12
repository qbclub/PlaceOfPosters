<script setup>
import { ref, onMounted } from 'vue';

import { usePrice } from '@/store/price';
import { useAuth } from "@/store/auth";


const userStore = useAuth();
const user = ref(userStore.user);

let priceStore = usePrice()
const { selectPrice } = defineProps(["selectPrice"]);
const emit = defineEmits(['closeDialog', 'purchase'])

let prices = ref([])
let select = ref()


async function buyPosters(buyEvent) {

    let res = await userStore.buyPosters(buyEvent);
    if (res.status == 200) {
        await userStore.getSubscriptionCount(userStore.user._id)
        emit('purchase')
    }
}


onMounted(async () => {
    prices.value = priceStore.prices
    if (selectPrice) {
        select.value = selectPrice
    } else {

        select.value = prices.value[0]
    }


});
</script>

<template>
    <v-card-text>

        <div class="d-flex">
            <v-select v-model="select" :items="prices" item-title="name" variant="outlined" return-object density="compact"
                single-line></v-select> &nbsp * {{ select?.price / select?.numberPosters }} руб. = {{ select?.price }} руб.
        </div>
    </v-card-text>
    <div class="d-flex justify-center">
        <v-btn @click=" emit('closeDialog')" color="accent" variant="outlined" class="ma-2">Отмена</v-btn>
        <v-btn color="accent" @click="buyPosters(select)" class="ma-2" :disabled="user.subscription.count>4">Оплатить</v-btn>
    </div>
</template>

<style scoped>
.v-input__details {
    min-height: 0 !important;
}
</style>