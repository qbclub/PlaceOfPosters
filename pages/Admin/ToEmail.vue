<script setup>
const userStore = useAuth();
import getPossibleLocations from "~/utility/dadata";
let showDialog = ref(false);
let showRemoveDialog = ref(false);
let email = ref("");
let user = ref(null);
let change = ref(false);
let select = ref("city_with_type");
let selectedManagerIn = ref();
let location = ref("");
let locationSearchRequest = ref("");
let possibleLocations = ref([]);
let managerCard = reactive({
  firstname: "",
  lastname: "",
  managerIn: [],
  email: "",
});

async function getUserManagerIn() {
  user.value = await userStore.getByEmail(email.value);
  if (user.value.data != null) {
    managerCard.firstname = user.value.data.firstname;
    managerCard.lastname = user.value.data.lastname;
    managerCard.managerIn = user.value.data.managerIn;
    managerCard.email = email.value;
    change.value = !change.value;
  } else {
    user.value = null;
  }
}

async function removeLocationToEmail(managerIn) {
  await userStore.removeLocationToEmail(managerIn, email.value);
  getUserManagerIn();
  showDialog.value = !showDialog.value;
}

async function addLocationToEmail() {
  let filteredLocation = location.value;
  switch (select.value) {
    case "city_with_type":
      filteredLocation = filteredLocation.city_with_type;
      break;
    case "area_with_type":
      filteredLocation = filteredLocation.area_with_type;
      break;
    case "region_with_type":
      filteredLocation = filteredLocation.region_with_type;
      break;
  }
  await userStore.addLocationToEmail(email.value, select.value, filteredLocation);
  getUserManagerIn();
}

async function removeManagerInLocations() {
  await userStore.removeManagerInLocations(email.value);
  showRemoveDialog.value = !showRemoveDialog.value;
  getUserManagerIn();
}

let openDialog = (managerIn) => {
  showDialog.value = !showDialog.value;
  selectedManagerIn.value = managerIn;
};

watch(locationSearchRequest, async (value) => {
  possibleLocations.value = await getPossibleLocations(value);
});
</script>
<template>
  <v-container>
    <v-row justify="center" class="pb-4">
      <v-col cols="12">
        <h3>Выбрать менеджера для рассылки</h3>
        <div class="d-flex mt-4">
          <v-text-field variant="outlined" label="Электронная почта" v-model="email" density="compact" class="mr-4" />
          <v-btn @click="getUserManagerIn()"> Выбрать</v-btn>
        </div>
      </v-col>
      <v-col lg="6" cols="12" v-show="user != null">
        <v-card style="outlined" min-height="150" class="main-card h-100">
          <v-card-title class="pb-0">
            Менеджер: {{ managerCard.firstname + " " + managerCard.lastname }}
            <v-icon @click="showRemoveDialog = !showRemoveDialog;" icon="mdi-close"
              style="position: absolute; right:0;top:0; cursor: pointer"></v-icon>
          </v-card-title>
          <span class="ml-4" style="font-size: 0.8em; opacity: 0.5">{{
            managerCard.email
          }}</span>
          <v-card-text v-for="managerIn in managerCard.managerIn" class="pb-2 pt-2">
            <span class="cursor-pointer" @click="openDialog(managerIn)">{{
              managerIn.type == "city_with_type"
                ? "Город"
                : managerIn.type == "area_with_type"
                  ? "Район"
                  : "Область/Край/Республика"
            }}
              - {{ managerIn.name }}</span>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col lg="6" cols="12" v-show="user != null">
        <v-card style="outlined" class="main-card">
          <v-card-title class="pb-0">
            Добавить локацию для рассылки
          </v-card-title>
          <v-card-text>
            <v-radio-group inline v-model="select" :hide-details="true">
              <v-radio label="Город" value="city_with_type"></v-radio>
              <v-radio label="Район" value="area_with_type"></v-radio>
              <v-radio label="Область" value="region_with_type"></v-radio>
            </v-radio-group>
            <v-autocomplete hide-details density="compact" v-model="location" v-model:search="locationSearchRequest"
              :items="possibleLocations" item-title="name" placeholder="Удмуртская Респ, г Глазов, ул Калинина, д 2а"
              item-value="geo" variant="outlined" clearable>
              <template v-slot:no-data>
                <div class="pt-2 pr-4 pb-2 pl-4">
                  {{
                    locationSearchRequest.trim().length < 3 ? "Минимум 3 символа" : "Не найдено" }} </div>
              </template>
            </v-autocomplete>
            <div class="d-flex justify-center">
              <v-btn @click="addLocationToEmail()" class="mt-4">Добавить</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-divider class="pb-8"></v-divider>

    <manager-list :change="change" @change-in-list="getUserManagerIn()"></manager-list>
    <v-dialog v-model="showDialog" width="auto">
      <v-card>
        <v-card-text class="d-flex flex-column">
          Удалить локацию для рассылки?
          <div class="d-flex justify-space-around">
            <v-btn @click="removeLocationToEmail(selectedManagerIn)">Да</v-btn>
            <v-btn @click="showDialog = !showDialog"> Нет</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showRemoveDialog" width="auto">
      <v-card>
        <v-card-text class="d-flex flex-column">
          Удалить локации для рассылки?
          <div class="d-flex justify-space-around">
            <v-btn @click="removeManagerInLocations()">Да</v-btn>
            <v-btn @click="showRemoveDialog = !showRemoveDialog"> Нет</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style type="scss" scoped>
.main_card {
  position: relative;
}
</style>
