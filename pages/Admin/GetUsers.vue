<script setup>
import { onMounted, ref } from 'vue';

import { useAppStore } from '@/store/app';

let appStore = useAppStore()

let users = ref([])
onMounted(async () => {
    users.value = await appStore.getUsers()
    console.log();
})
</script>
<template>
    <v-row class="mt-4 mb-16">
        <v-col cols="12">
            <v-table density="compact">
                <thead>
                    <tr>
                        <th class="text-left">
                            Имя
                        </th>
                        <th class="text-left">
                            Email
                        </th>
                        <th class="text-left">
                            Телефон
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user">
                        <td> {{ user.firstname }}
                            {{ user.lastname }}</td>
                        <td> <a :href="'mailto:' + user.email">
                                {{ user.email }}
                            </a>
                        </td>
                        <td> {{ user.phone }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-col>
    </v-row>
</template>~/stores/app