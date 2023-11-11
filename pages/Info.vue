<script setup>
// import { onMounted } from "vue";
// import { useRouter } from "vue-router";
// import { usePrice } from '@/store/price';
// import BackButton from '@/components/BackButton.vue'

// let priceStore = usePrice()
// let router = useRouter();

// onMounted(async () => {
//     if (!priceStore.prices.length) {
//         await priceStore.fetchPrices()
//     }

// })
</script>
<template>
    <v-container>
        <!-- <v-row>
            <v-col>
                <BackButton />
            </v-col>
        </v-row> -->
        <v-row class="d-flex flex-column flex-md-row">
            <v-col cols="12" md="2">
                <div class="d-flex justify-center flex-wrap flex-md-column">
                    <div @click="navigateTo(`/info/landing`)" class=" menu-btn">
                        цены
                    </div>
                    <div @click="navigateTo(`/info/rules`)" class=" menu-btn">
                        правила
                    </div>
                    
                        <div @click="navigateTo('/info/contacts')" class="menu-btn">

                            контакты
                        </div>
               
                </div>
            </v-col>
            <v-col cols="12" md="10">
                <NuxtPage />
            </v-col>


        </v-row>
    </v-container>
</template>

<style lang="scss" scoped>
.animation:not(:hover) {
    transform: scale(1);
    transition: all 0.5s;
}

.animation:hover {
    transform: scale(1.03);
    transition: all 0.5s;
}

.menu-btn {
    cursor: pointer;
    text-align: center;
    font-weight: 500;
    font-size: 15px;
    margin: 8px;
    transition: all 0.5s;
    text-transform: uppercase;

    &:hover {
        transform: scale(1.05);
        color: #ED413E;

    }
}
</style>