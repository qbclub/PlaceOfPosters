<script setup>


const userStore = useAuth();
const user = ref(userStore.user);
let posterStore = usePoster();

let activePosters = ref([]);
let loading = ref(true)

let getPosters = async () => {
  activePosters.value = await posterStore.getPosters(user.value._id, 'active')
  loading.value = false

}
onMounted(async () => {
  getPosters()
});
</script>
<template>
  <div>
    <div v-if="activePosters.length">
      <PostersList :actions="['delete', 'hide', 'prolong']" :posters="activePosters" @getPosters="getPosters"
        :posterType="'active'" />
    </div>

    <div v-else v-if="!loading">У вас нет опубликованных афиш</div>
    <div class="d-flex justify-center"><v-progress-circular indeterminate color="accent" :size="60" :width="10"
        v-if="loading"></v-progress-circular></div>
  </div>
</template>
<style scoped></style>
~/stores/poster~/stores/auth