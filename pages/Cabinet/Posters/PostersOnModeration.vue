<script setup>


const userStore = useAuth();
const user = ref(userStore.user);

let posterStore = usePoster();

let postersOnModeration = ref([]);
let loading = ref(true)

let getPosters = async () => {
  postersOnModeration.value = await posterStore.getPosters(user.value._id, 'onModeration')
  loading.value = false
}

onMounted(async () => {
  getPosters()
});
</script>
<template>
  <div>
    <div v-if="postersOnModeration.length">
      <PostersList :posters="postersOnModeration" @getPosters="getPosters" :actions="['delete']" />
    </div>
    <div v-else v-if="!loading">У вас нет афиш на модерации</div>
    <div class="d-flex justify-center"><v-progress-circular indeterminate color="accent" :size="60" :width="10"
        v-if="loading"></v-progress-circular></div>
  </div>
</template>
<style lang="scss" scoped></style>
~/stores/poster