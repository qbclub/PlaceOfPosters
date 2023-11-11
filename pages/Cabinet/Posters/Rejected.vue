<script setup>
import { ref, onMounted } from "vue";
import PostersList from "@/views/Cabinet/PostersList.vue"
import { usePoster } from "@/store/poster";
import { useAuth } from "../../store/auth";

const userStore = useAuth();
const user = ref(userStore.user);
let posterStore = usePoster();

let rejectedPosters = ref([]);
let loading = ref(true)


let getPosters = async () => {
    rejectedPosters.value = await posterStore.getPosters(user.value._id, 'rejected')
    loading.value = false
}
onMounted(async () => {
    getPosters()
});
</script>
<template>
    <div v-if="rejectedPosters.length">
        <PostersList :posters="rejectedPosters" @getPosters="getPosters"  :actions="['delete', 'edit', 'message']"/>
    </div>
    <div v-else v-if="!loading">У вас нет афиш для исправления</div>
    <div class="d-flex justify-center"><v-progress-circular indeterminate color="accent" :size="60" :width="10"
      v-if="loading"></v-progress-circular></div>
</template>
<style scoped></style>
