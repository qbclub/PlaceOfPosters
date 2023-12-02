<script setup>


const PriceStore = usePrice();

let priceForm = reactive({
    name: '',
    numberPosters: '',
    price: '',
    salePrice: ''
})

async function submit() {
    priceForm.name = priceForm.name.trim()
    await PriceStore.addPrice(priceForm)
}
</script>
<template>
    <v-sheet width="300" class="mx-auto">
        <v-form @submit.prevent='submit'>
            <v-text-field v-model="priceForm.name" label="Назввание"></v-text-field>
            <v-text-field v-model="priceForm.numberPosters" label="Колличество афиш"></v-text-field>
            <v-text-field v-model="priceForm.price" label="Цена"></v-text-field>
            <v-text-field v-model="priceForm.salePrice" label="Цена со скидкой"></v-text-field>
            <v-btn type="submit" block class="mt-2">Отправить</v-btn>
        </v-form>
    </v-sheet>
</template>
<style scoped></style>