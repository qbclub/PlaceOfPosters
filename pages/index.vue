<script setup>
import { getData, setData } from 'nuxt-storage/local-storage';

let data = ref(1)
let data2 = ref()
let click = () => {
    data2.value++
}

watch(data2, () => {
    data.value = data2.value
    setData('data', data.value)
})

onMounted(() => {
    data2.value = getData('data', data.value)
    setData('data', data.value)
})


</script>
<template>
    <div class="text-center">
        <span @click="click()">start</span> 
        {{ data}}
    </div>
</template>