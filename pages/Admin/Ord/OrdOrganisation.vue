<script setup>
import { reactive, watch, ref, onMounted } from 'vue'
import getPossiblePartner from "../../plugins/dadataINN";
import OrdService from '@/service/OrdService'
import _ from 'lodash'
import { uid } from 'uid';
let types = reactive(["fl", "ul", "ip", "ffl", "ful"])
let inn = ref('182900345213')
let error = reactive({})
let selectOrg = ref({})

let organization = reactive(
    {
        // id: uid(8),
        id: '7b0b6b8c',
        type: "ip",
        isOrs: false,
        isRr: true,
        inn: '182900345213',
        name: "ИП Грачев Андрей Викторович",
        mobilePhone: "89068970429",
        platforms: [
            {
                // platformId: uid(8),
                platformId: "b0b6b8ca",
                type: "site",
                isOwned: true,
                name: "PlPo",
                url: "https://plpo.ru"
            }]
    }
)
let send = async () => {
    let toSend = Object.assign({}, organization)
    let res = await OrdService.createOrganisation(toSend)
}
watch(inn, async (oldData, newData) => {

    error = {}
    if (oldData < newData) {
        selectOrg.value = {}

    }

    if (inn.value.trim().length == 10) {

        let res = await getPossiblePartner(inn.value.trim())
        if (res.length) {
            selectOrg.value = res[0]
            organization.name = selectOrg.value?.partner.value
            organization.inn = inn.value

        }
    }
    if (inn.value.trim().length == 12) {

        let res = await getPossiblePartner(inn.value.trim())
        if (res.length) {
            selectOrg.value = res[0]
            organization.name = selectOrg.value?.partner.value
            organization.inn = inn.value

        } else {

            selectOrg.value = {}
        }


    }



})
onMounted(async () => {
    // organization.inn = inn.value
    // await getPossiblePartner(inn.value.trim())
})


</script>


<template>
    <v-row class="ma-8">
        <v-col cols="12" sm="6" md="4">
            <h3 class="ma-2">Организация</h3>


            <v-autocomplete label="Тип" :items="types" variant="outlined" v-model="organization.type"
                density="compact"></v-autocomplete>

            <div class="text-caption font-weight-bold">
                <div>{{ organization.isOrs }}</div>
                <v-checkbox label="Оператор рекламных систем" v-model="organization.isOrs" density="compact"></v-checkbox>
            </div>
            <div class="text-caption font-weight-bold">
                <div>{{ organization.isRr }}</div>
                <v-checkbox label="Рекламо распространитель" v-model="organization.isRr" density="compact"></v-checkbox>
            </div>

            <v-text-field variant="outlined" label="ИНН" v-model="inn" density="compact" />
            <div class="pa-4" >
                Name: {{ organization.name}}
            </div>
            <v-text-field variant="outlined" label="Телефон" v-model="organization.mobilePhone" density="compact" />
            <div class="d-flex justify-center">
                <v-btn @click="send()" class="ma-4" disabled>Отправить</v-btn>
            </div>

        </v-col>
        <v-col cols="12" sm="6" md="4">
           {{ JSON.stringify(organization) }}

        </v-col>


    </v-row>
</template>