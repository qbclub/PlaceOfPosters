<script setup>
const userStore = useAuth()

let contracts = ref(userStore.user?.contracts)
let snackbar = ref(false)
let snackbarText = ref('')
let contractDialog = ref(false);
let closeDialog = () => {
    contractDialog.value = false
}
</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-container>
                <h3>Рекламодатели</h3>

                <v-row class="mt-1">
                    <v-col cols="auto" v-for="contract in userStore.user?.contracts" class="d-flex flex-wrap">
                        <v-card class="pa-4">
                            <div>{{ contract.name }}</div>
                            <div>ИНН: {{ contract.inn }}</div>
                        </v-card>
                    </v-col>
                </v-row>
                
                <v-btn 
                    @click="contractDialog = true" 
                    color="accent" 
                    variant="outlined"
                    class="mt-6"
                >
                    Создать
                </v-btn>
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
        </v-col>
    </v-row>
</template>