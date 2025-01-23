<script setup>

let posterStore = usePoster()

let postersOnModeration = ref([])
let dialog = ref(false);
let dialogTitle = ref('');
let selectedAction = ref('');
let selectedPoster = ref({});

let actionDialog = (poster, action, title) => {
    dialog.value = true;
    dialogTitle.value = title
    selectedPoster.value = poster;
    selectedAction.value = action
}
let acceptAction = () => {
    if (selectedAction.value == 'delete') {
        deletePoster(selectedPoster.value._id)
    }

}

async function deletePoster(id) {
    let res = await posterStore.deletePosterById(id)
    if (res.status == 200) {
        dialog.value = false;
        dialogTitle.value = ''
        selectedAction.value = ''
        getPostersOnModeration()
    }
}
async function checkPoster(id) {
    navigateTo(`/admin/moderation/moderateposter?_id=${id}`)
}


let getPostersOnModeration = async () => {
    postersOnModeration.value = await posterStore.getPostersOnModeration('onmoderation')
}

onMounted(async () => {
    getPostersOnModeration()
})
</script>
<template>
    <v-row v-if="postersOnModeration.length">
        <v-col cols="6" sm="3" md="2" class="pa-2" v-for="poster of postersOnModeration" :key="poster._id">
           
            <ModerationPosterCard :poster="poster"></ModerationPosterCard>
            <div class="text-center"> {{ poster.creator.email }}</div>
           
            <div class="d-flex justify-center pa-1">
                <v-icon @click="actionDialog(poster, 'delete', 'Удалить?')" icon="mdi-trash-can-outline" size="small"
                    class="action-button">
                </v-icon>
                <v-icon @click="checkPoster(poster._id)" icon="mdi-check-all" size="small"
                    class="action-button">
                </v-icon>
               
            </div>

            
        </v-col>
        <v-dialog v-model="dialog" width="auto">
            <v-card>
                <v-card-title> {{ dialogTitle }} </v-card-title>
                <v-card-actions>
                    <v-btn color="accent" variant="outlined" @click="dialog = false" :ripple="false">нет</v-btn>
                    <v-btn color="accent" @click="acceptAction()" variant="flat">да</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
    <v-row v-else>
        <v-col>
            всё проверено
        </v-col>
    </v-row>
</template>

<style lang="scss" scoped>
.action-button {
    cursor: pointer;
    margin: 4px;
}


</style>~/stores/poster