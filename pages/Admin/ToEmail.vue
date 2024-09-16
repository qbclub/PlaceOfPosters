<script setup>
const userStore = useAuth();
import getPossibleLocations from "~/utility/dadata";
let email = ref("");
let select = ref("");
let location = ref("");
let locationSearchRequest = ref("");
let possibleLocations = ref([]);
let managerCard = reactive({
  firstname: "",
  lastname: "",
  managerIn: [],
});
async function getUserManagerIn() {
  let user = await userStore.getByEmail(email.value);
  managerCard.firstname = user.data.firstname;
  managerCard.lastname = user.data.lastname;
  managerCard.managerIn = user.data.managerIn;
}
watch(locationSearchRequest, async (value) => {
  possibleLocations.value = await getPossibleLocations(value);
});
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <div class="d-flex">
          <v-text-field
            variant="outlined"
            label="Электронная почта"
            v-model="email"
            density="compact"
            class="mr-4"
          />
          <v-btn @click="getUserManagerIn()"> Выбрать менеджера </v-btn>
        </div>
        <v-card style="outlined">
          <v-card-title>
            Менеджер: {{ managerCard.firstname + " " + managerCard.lastname }}
          </v-card-title>
          <v-card-text v-for="managerIn in managerCard.managerIn">
            {{ managerIn.type }} - {{ managerIn.name }}
            <v-btn @click="removeLocationToEmail()">Удалить</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" v-if="managerCard.managerIn.length!=0">
        Добавить локацию для рассылки
        <v-radio-group inline v-model="select" :hide-details="true">
          <v-radio label="Город" value="city_with_type"></v-radio>
          <v-radio label="Регион" value="area_with_type"></v-radio>
          <v-radio label="Область" value="region_with_type"></v-radio>
        </v-radio-group>
        <v-autocomplete
          hide-details
          density="compact"
          v-model="location"
          v-model:search="locationSearchRequest"
          :items="possibleLocations"
          item-title="name"
          placeholder="Удмуртская Респ, г Глазов, ул Калинина, д 2а"
          item-value="geo"
          variant="outlined"
          clearable
        >
          <template v-slot:no-data>
            <div class="pt-2 pr-4 pb-2 pl-4">
              {{
                locationSearchRequest.trim().length < 3
                  ? "Минимум 3 символа"
                  : "Не найдено"
              }}
            </div>
          </template>
        </v-autocomplete>
        <v-btn @click="addLocationToEmail()" class="mt-4">Добавить</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<style type="scss" scoped></style>
