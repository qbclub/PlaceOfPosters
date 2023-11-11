<script setup>
import { useRouter } from "vue-router";

let router = useRouter()
</script>

<template>
  <div @click="router.back()" class="pa-1 cursor-pointer text-body-1"><span class="mdi mdi-arrow-left"></span> назад</div>
</template>