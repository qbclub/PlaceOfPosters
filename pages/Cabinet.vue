<script setup>
// import { ref, watch, onMounted } from "vue";
// import { useAuth } from "@/store/auth";
// import { useRouter } from "vue-router";
// import { usePrice } from '@/store/price';
// const router = useRouter();

// let tab = ref(0);

// let authStore = useAuth();
// let priceStore = usePrice()
// if (authStore.user == null) {
//   router.push("/auth");
// }
// async function logout() {
//   await authStore.logout();
//   router.push("/posters");
// }
// onMounted(async () => {
//   if (!priceStore.prices.length) {
//     await priceStore.fetchPrices()
//   }

// })

</script>

<template>
  <v-container>
    <v-row class="justify-space-betwin">
      <v-col>
        <h2>Кабинет</h2>
      </v-col>
      <v-col @click="logout" style="cursor: pointer" cols="auto" class="d-flex flex-row">
        <v-icon>mdi-logout</v-icon>
        <div class="ml-1">выйти</div>
      </v-col>
    </v-row>
    <v-tabs v-model="tab">
      <v-tab :ripple="false" value="0" to="/cabinet/me"> О вас </v-tab>
      <v-tab :ripple="false" value="2" to="/cabinet/contract"> Договоры </v-tab>
      <v-tab :ripple="false" value="1" to="/cabinet/posters/active"> Афиши </v-tab>
      <v-tab :ripple="false" value="3" to="/cabinet/eventlog"> Оплаты </v-tab>
    </v-tabs>
    <router-view />
  </v-container>
</template>
