<script setup>

import _ from 'lodash'
import { uid } from 'uid';

import dates from "~/utility/dates"
import newNumber from '~/utility/getRandomInt'
import validateInn from '~/utility/validateInn'
import getPossiblePartner from "~/utility/dadataINN";

import OrdService from '~/service/OrdService'

const userStore = useAuth();
const appState = useAppStore().appState;

let inn = ref('')
let fio = ref('')
let isCitizen = ref(false)
let error = reactive({})
let creator = ref({})
const emit = defineEmits(['closeDialog', 'createContract'])

let contractInfo = reactive({
    name: '',
    inn: '',
    okved: '',
    contract: {
        id: '',
        type: "contract",
        clientId: "",
        contractorId: "",
        isRegReport: true,
        actionType: "distribution",
        subjectType: "org-distribution",
        number: 1,
        date: "2022-09-01",
        amount: 150,
        isVat: false
    }
})


let validate = async () => {
    let validInn = validateInn(Number(inn.value), error)
    if (validInn && contractInfo.name.length > 5) {
      await  OrdService.createContract({form:contractInfo, userId:userStore.user._id})
      await userStore.checkAuth()
      emit('closeDialog')
    }
}

watch(inn, async (oldData, newData) => {

    error = {}
    if (oldData < newData) {
        creator.value = {}
        isCitizen.value = false
        fio.value = ""
    }

    if (inn.value.trim().length == 10) {
        validateInn(Number(inn.value), error)
        let res = await getPossiblePartner(inn.value.trim())
        if (res.length) {
            creator.value = res[0]
            contractInfo.name = res[0].partner.data.name.short_with_opf
            contractInfo.okved = res[0].partner.data.okved
            contractInfo.inn = inn.value
            isCitizen.value = false
        }
    }
    if (inn.value.trim().length == 12) {
        validateInn(Number(inn.value), error)
        let res = await getPossiblePartner(inn.value.trim())
        if (res.length) {
            creator.value = res[0]
            contractInfo.name = res[0].partner.data.name.short_with_opf
            contractInfo.okved = res[0].partner.data.okved
            contractInfo.inn = inn.value
            isCitizen.value = false
        } else {
            contractInfo.okved = ''
            isCitizen.value = true
            contractInfo.inn = inn.value
            contractInfo.name = fio.value
            creator.value = {}
        }
    }
})
watch(fio, () => {
    contractInfo.name = fio.value
})
onMounted( async() => {

    contractInfo.contract.clientId = uid(8)
    contractInfo.contract.contractorId =  await appState?.organization.id
    contractInfo.contract.id = uid(8)
    contractInfo.contract.number = String(newNumber())
    contractInfo.contract.date = dates.dateForOrd()

})
</script>
<template>
    <v-container>
        <v-responsive>
    
            <v-row class="d-flex justify-center pa-4">

                <v-col cols="12">

                    <h2 class="text-center ">Рекламодатель</h2>
                    <b>ИНН</b>
                    <v-text-field placeholder="1837000000" variant="outlined" v-model="inn" class="w-100 pa-0" />
                    <div class="text-caption" style="color:#ED413E">{{ error.message }}</div>
                    <b v-if="isCitizen">ФИО</b>
                    <div v-if="isCitizen">
                        <v-text-field placeholder="Иванов Иван Иванович" variant="outlined" v-model="fio" class="w-100"
                            maxlength="50" />

                    </div>

                    <div class="pa-1">
                        <p v-if="inn">ИНН: {{ inn }}</p>
                        <p v-if="isCitizen">ФИО: {{ fio }}</p>
                        <p v-if="!_.isEmpty(creator)">{{ creator?.partner.data.name.short_with_opf }}</p>
                        <!-- <p v-if="!_.isEmpty(creator)">{{ creator?.partner.data.type }}</p> -->
                        <p v-if="!_.isEmpty(creator)">ОКВЭД: {{ creator?.partner.data.okved }}</p>
                    </div>
                    <div class="d-flex justify-center">
                        <v-btn @click=" emit('closeDialog')" color="accent" variant="outlined" class="ma-2">Отмена</v-btn>
                        <v-btn color="accent" @click="validate()" class="ma-2">Сохранить</v-btn>
                    </div>

                </v-col>
            </v-row>
        </v-responsive>
    </v-container>
</template>
<style></style>../../PLUGINS_TEMP/dadataINN~/PLUGINS_TEMP/dates../../PLUGINS_TEMP/getRandomInt