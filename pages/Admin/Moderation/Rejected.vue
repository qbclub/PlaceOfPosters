<script setup>

let posterStore = usePoster()

let rejectedPosters = ref([])
let dialog = ref(false);
let dialogTitle = ref('');
let selectedAction = ref('');
let selectedPoster = ref({});

let message = ref(false);
let messageText = ref('');

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
async function checkPoster(id) {
    navigateTo(`/admin/moderation/moderate?_id=${id}`)
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
function showMessage(moderationMessage) {
    message.value = true
    messageText.value = moderationMessage
}

onMounted(async () => {
    rejectedPosters.value = await posterStore.getPostersOnModeration('rejected')
})
</script>
<template>
    <v-row v-if="rejectedPosters.length">
        <v-col cols="6" sm="3" md="2" class="pa-2" v-for="poster of rejectedPosters" :key="poster._id">
            <ModerationPosterCard :poster="poster"></ModerationPosterCard>
            <div class="d-flex justify-center pa-1">
                <v-icon @click="actionDialog(poster, 'delete', 'Удалить?')" icon="mdi-trash-can-outline" size="small"
                    class="action-button">
                </v-icon>
                <v-icon @click="showMessage(poster.moderationMessage)" icon="mdi-message-text-outline" size="small"
                    class="action-button">
                </v-icon>


            </div>
            <div class="message" @click="showMessage(poster.moderationMessage)">{{ poster.moderationMessage }}</div>
        </v-col>
        <v-dialog v-model="dialog" width="auto">
            <v-card>
                <v-card-title> {{ dialogTitle }} </v-card-title>
                <v-card-actions>
                    <v-btn color="accent" variant="outlined" @click="dialog = false" :ripple="false">нет</v-btn>
                    <v-btn color="accent" @click="acceptAction()" variant="flat">да</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog><v-dialog v-model="message" max-width="500">
            <v-card>
                <v-card-title> Замечания </v-card-title>
                <v-card-text class="pa-2">{{ messageText }}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="accent" variant="outlined" @click="message = false" :ripple="false">закрыть</v-btn>

                </v-card-actions>

            </v-card>
        </v-dialog>

    </v-row>
    <v-row v-else>
        <v-col>
            пусто
        </v-col>
    </v-row>
</template>
<style lang="scss" scoped>
.action-button {
    cursor: pointer;
    margin: 4px;
}

.message {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;

}
</style>~/stores/poster