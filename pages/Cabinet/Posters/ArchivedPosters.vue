<script setup>
import { ref, onMounted } from "vue";
import PostersList from "@/views/Cabinet/PostersList.vue"
import { usePoster } from "@/store/poster";
import { useAuth } from "../../store/auth";
const userStore = useAuth();
const user = ref(userStore.user);
let posterStore = usePoster();


let archivePosters = ref([]);
let loading = ref(true)

let getPosters = async () => {
  archivePosters.value = await posterStore.getPosters(user.value._id, 'archive')
  loading.value = false
}

onMounted(async () => {
  getPosters()
});
</script>
<template>
  <div v-if="archivePosters.length">
    <PostersList :posters="archivePosters" @getPosters="getPosters"  :actions="['delete', 'prolong']" />
  </div>
  <div v-else v-if="!loading">У вас нет старых афиш </div>
  <div class="d-flex justify-center"><v-progress-circular indeterminate color="accent" :size="60" :width="10"
      v-if="loading"></v-progress-circular></div>
</template>
<style scoped></style>
~/stores/poster