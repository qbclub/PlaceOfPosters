<script setup>
// import { EHtml, EHead, ESection, EPreview } from 'vue-email';

defineProps({ title: String })
</script>
<template>
    <e-html lang="en">
        <e-head>
            <title>Создана Афиша {{ title }}</title>
            <!-- <meta name="description" content="Description" /> -->
        </e-head>
        <e-preview>Превью {{ title }}</e-preview>
        <e-section>
            афиша создана {{ title }}
        </e-section>
    </e-html>
</template>
<style></style>