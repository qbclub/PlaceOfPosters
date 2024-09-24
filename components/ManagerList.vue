<script setup>
const userStore = useAuth();
let managersList = ref([]);
let selectedUser = ref();
let showDialog = ref(false);

let props = defineProps({
  email:String
})
watch(props,()=>{
  getOtherManagers()
})


async function getOtherManagers() {
  managersList.value = await userStore.getOtherManagers(props.email);
}
async function removeManagerIn(email) {
  await userStore.removeManagerIn(email);
  getOtherManagers()
}
async function removeLocationToEmail(selectedUser) {
    console.log(selectedUser)
  await userStore.removeLocationToEmail(selectedUser.managerIn,selectedUser.email);
  showDialog.value = !showDialog.value;
  getOtherManagers()
}
let openDialog = (managerIn,email) => {
  showDialog.value = !showDialog.value;
  selectedUser.value = {managerIn:managerIn,email:email};
};
getOtherManagers();
</script>
<template>
  <v-row>
    <v-col cols="12" lg="4" v-for="managerCard in managersList.data">
      <v-card style="outlined" min-height="150" class="main-card">
        <v-card-title class="pb-0">
          Менеджер: {{ managerCard.firstname + " " + managerCard.lastname }}
          <v-icon
            @click="removeManagerIn(managerCard.email)"
            icon="mdi-close-circle"
            style="position: absolute; left: 90%; cursor: pointer"
          ></v-icon>
        </v-card-title>
        <span class="ml-4" style="font-size: 0.8em; opacity: 0.5">{{
          managerCard.email
        }}</span>
        <v-card-text v-for="managerIn in managerCard.managerIn" class="pb-2 pt-2">
          <span class="cursor-pointer" @click="openDialog(managerIn,managerCard.email)"
            >{{
              managerIn.type == "city_with_type"
                ? "Город"
                : managerIn.type == "area_with_type"
                ? "Район"
                : "Область/Край/Республика"
            }}
            - {{ managerIn.name }}</span
          >
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-dialog v-model="showDialog" width="auto">
    <v-card>
      <v-card-text class="d-flex flex-column">
        Удалить локацию для рассылки?
        <div class="d-flex justify-space-around">
          <v-btn @click="removeLocationToEmail(selectedUser)">Да</v-btn>
          <v-btn @click="showDialog = !showDialog"> Нет</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<style></style>
