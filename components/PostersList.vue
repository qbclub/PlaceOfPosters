<script setup>
import dates from "~/utility/dates"

const userStore = useAuth();
const posterStore = usePoster();

const { posters, actions, posterType, isAdminPage } = defineProps(["posters", "actions", "posterType", "isAdminPage"]);

const emit = defineEmits(['getPosters'])

let dialog = ref(false);
let buyDialog = ref(false);
let dialogTitle = ref('');
let selectedAction = ref('');
let selectedPoster = ref({});

let message = ref(false);
let messageText = ref('');

let closeDialog = () => {
    buyDialog.value = false

}

let purchase = async () => {
    await userStore.getSubscriptionCount(userStore.user._id)
    buyDialog.value = false
    snackbarText.value = 'Афишы куплены'
    snackbar.value = true
}
function showMessage(moderationMessage) {
    message.value = true
    messageText.value = moderationMessage
}

async function deletePoster(id) {
    let res = await posterStore.deletePosterById(id)
    if (res.status == 200) {
        dialog.value = false;
        dialogTitle.value = ''
        selectedAction.value = ''
        emit('getPosters')
    }
}
async function hidePoster(_id, isHidden) {
    await posterStore.hidePosterById(_id, isHidden).then(() => {
        dialog.value = false;
        dialogTitle.value = ''
        selectedAction.value = ''
        emit('getPosters')
    })
}
async function prolongPoster() {
    let onModeration = await posterStore.getPosters(userStore.user._id, 'onModeration')
    if (!(userStore.user.subscription.count - onModeration.length)) {
        dialog.value = false;
        buyDialog.value = true
        return
    }
    let publicationStart = selectedPoster.value.publicationDate
    let publicationEnd = selectedPoster.value.endDate
    let id = selectedPoster.value._id
    if (checkPayment.value) {
        // 2592000000 - 30 дней
        if (publicationEnd >= Date.now()) {
            publicationEnd = publicationEnd + 2592000000
            publicationStart = publicationStart
        }
        if (publicationEnd < Date.now()) {
            publicationEnd = Date.now() + 2592000000
            publicationStart = Date.now()
        }
        let res = await posterStore.prolongPosterById(id, publicationStart, publicationEnd, userStore.user._id)
        if (res.status == 200) {
            dialog.value = false;
            dialogTitle.value = ''
            selectedAction.value = ''
            emit('getPosters')
            userStore.getSubscriptionCount(userStore.user._id)
        }
    } else {
        dialog.value = false;
        buyDialog.value = true;
    }

}

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
    if (selectedAction.value == 'hide') {
        let isHidden = !selectedPoster.value.isHidden
        hidePoster(selectedPoster.value._id, isHidden)
    }
    if (selectedAction.value == 'prolong') {
        prolongPoster()
    }
    if (selectedAction.value == 'edit') {
        dialog.value = false;
        if (isAdminPage) {
            navigateTo({ path: '/editposter', query: { hotfix: 'true', _id: selectedPoster.value._id } })
        }
        else {
            navigateTo('/editposter')
        }
    }
}


let checkPayment = computed(() => {
    return userStore.user.subscription.count
})

let getIcon = (poster) => {
    return poster.isHidden ? " mdi-eye-outline" : "mdi-eye-off-outline"
}

</script>
<template>
    <v-row>
        <v-col v-for="poster of posters" cols="4" sm="3" md="2" class="pa-1">
            <PosterCard :poster="poster" />
            <div class="text-center" v-if="posterType == 'active' && poster.endDate">до {{ dates.clearDate(poster.endDate)
            }}</div>
            <div class="d-flex justify-center pa-1">
                <v-icon v-if="actions.includes('delete')" @click="actionDialog(poster, 'delete', 'Удалить?')"
                    icon="mdi-trash-can-outline" size="small" class="action-button">
                </v-icon>
                <v-icon v-if="actions.includes('hide')"
                    @click="actionDialog(poster, 'hide', poster.isHidden ? 'Показать?' : 'Скрыть?')" :icon="getIcon(poster)"
                    size="small" class="action-button">
                </v-icon>
                <v-icon v-if="actions.includes('prolong')" @click="actionDialog(poster, 'prolong', 'Продлить?')"
                    icon="mdi-update" size="small" class="action-button">
                </v-icon>
                <v-icon v-if="actions.includes('edit')" @click="actionDialog(poster, 'edit', 'Редактировать?')"
                    icon="mdi-image-edit-outline" size="small" class="action-button">
                </v-icon>
                <v-icon v-if="actions.includes('message')" @click="showMessage(poster.moderationMessage)"
                    icon="mdi-message-text-outline" size="small" class="action-button">
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
        <v-dialog v-model="buyDialog" width="auto">
            <v-card class="pa-2">
                <v-card-title> Покупка </v-card-title>
                <Buy @closeDialog="closeDialog" @purchase="purchase" />
            </v-card>
        </v-dialog>
        <v-dialog v-model="message" max-width="500">
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
</template>
<style lang="scss" scoped>
.action-button {
    cursor: pointer;
    margin: 4px;


}
</style>
~/PLUGINS_TEMP/dates