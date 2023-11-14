<script setup>
import { useAuth } from "~/store/auth";
import { useRouter } from "vue-router";

const userStore = useAuth()
let router = useRouter()

let snackbar = ref(false)
let snackbarText = ref('')
let contractDialog = ref(false);
let closeDialog = () => {
    contractDialog.value = false
}

</script>
<template>
    <v-container>
        <h3>Рекламодатели</h3>
        <v-row>
            
            <v-col class="d-flex flex-wrap">
                <v-card v-for="contract in userStore.user.contracts " class="pa-4 ma-2">
                    <div>{{ contract.name }}</div>
                    <div>ИНН: {{ contract.inn }}</div>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-btn @click="contractDialog = true" color="accent" variant="outlined" > Создать</v-btn>
            </v-col>

        </v-row>
    </v-container>
    <v-snackbar v-model="snackbar" color="success" timeout="2000">
        {{ snackbarText }}
        <template v-slot:actions>
            <v-btn @click="snackbar = false" density="compact" icon="mdi-close"></v-btn>
        </template>
    </v-snackbar>

    <v-dialog v-model="contractDialog" width="auto">
        <v-card class="pa-2">
            <ContractForm @closeDialog="closeDialog" />
            <!-- <Buy @closeDialog="closeDialog" @purchase="purchase" /> -->
        </v-card>
    </v-dialog>
</template>