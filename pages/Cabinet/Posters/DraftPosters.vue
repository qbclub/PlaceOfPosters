<script setup>


const userStore = useAuth();
const user = ref(userStore.user);

let posterStore = usePoster();
let draftPosters = ref([]);
let loading = ref(true)


let getPosters = async () => {
    draftPosters.value = await posterStore.getPosters(user.value._id, 'draft')
    loading.value = false
}
onMounted(async () => {
    getPosters()
});
</script>
<template>
    <div>
        <div v-if="draftPosters.length">
            <PostersList :posters="draftPosters" @getPosters="getPosters" :actions="['delete', 'edit']" />
        </div>
        <div v-else v-if="!loading">У вас нет черновиков афиш</div>
        <div class="d-flex justify-center"><v-progress-circular indeterminate color="accent" :size="60" :width="10"
                v-if="loading"></v-progress-circular></div>
    </div>
</template>
<style scoped></style>
~/stores/poster