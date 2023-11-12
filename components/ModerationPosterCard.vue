<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

let router = useRouter();
const { poster } = defineProps(["poster"]);

let is_active = ref(false);
let is_img_active = ref(true);

watch(is_active, (value) => {
  if (!value) return is_img_active.value = true;

  setTimeout(() => {
    is_img_active.value = false;
  }, 380);
});

let like = ref(false)
</script>

<template>
  <div class="card" @click="router.push(`/admin/moderation/moderate?_id=${poster._id}`)">
    <div class="card-front cursor-pointer" :style="`border-radius: 8px; 
           background: #e4e4e4 url(${poster.image}) 50% 50% no-repeat; 
           background-size: cover;`" />
  </div>
</template>

<style scoped lang="scss">
.card {
  width: 100%;
  box-sizing: border-box;
  aspect-ratio: 1/1.414213562;
  background-color: transparent;
  perspective: 1000px;
  border-radius: 8px;
}

.card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
</style>