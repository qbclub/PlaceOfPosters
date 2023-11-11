<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuth } from "../../store/auth";
import { useLogsStore } from "../../store/logs";


let page = ref(1)
const userStore = useAuth()
const logsStore = useLogsStore()
let length = ref(1)
let user = userStore.user

let tableHeader = ref([
    "дата", "тип", "название", "количество", "стоимость", "сумма"
])
// let eventLog = ref(logsStore.userLogState)

const clearDate = (dataString) => {
    let date = 0
    if (dataString.length == 13) {
        const dataFromString = new Date(Number(dataString));
        date = dataFromString

    } else {
        date = new Date(dataString)
    };
    return date.toLocaleDateString("ru-Ru", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",

    })
}
let returnColor = (type) => {
    if (type == "оплата") {
        return 'green'
    }
    if (type == "публикация") {
        return 'red'
    }
    if (type == "продлений") Х
    return 'yellow'


}
watch(page, async () => {
    await logsStore.getLogsByUserId(user._id, page.value)
})

onMounted(async () => {
    await logsStore.getLogsByUserId(user._id, page.value)
    let logsLength = await logsStore.getLogsLength(user._id)
    length.value = Math.ceil(Number((logsLength.data / 10)))
})
</script>

<template>
    <v-container>
        <v-row>
            <v-col>
                <div>
                    <v-pagination v-model="page" :length="length" :total-visible="5">
                    </v-pagination>
                </div>
                <v-table fixed-header density="compact">
                    <thead>
                        <tr>
                            <th class="text-left" v-for="title in tableHeader ">
                                {{ title }}
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item, index in logsStore.userLogState" :key="index" :class="returnColor(item.type)">
                            <td> {{ clearDate(item.date) }} </td>
                            <td>{{ item.type }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.amount }}</td>
                            <td>{{ item.price }}</td>
                            <td>{{ item.total }}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td> <b>Остаток:</b> </td>
                            <td> <b>{{ user.subscription.count }}</b> </td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>

        </v-row>
    </v-container>
</template>
<style lang="scss" scoped>
.red {
    background-color: rgba(237, 65, 62, 0.1);
}

.green {
    background-color: rgba(49, 187, 58, 0.1);
}

.yellow {
    background-color: rgb(237, 143, 62, 0.1)
}
</style>