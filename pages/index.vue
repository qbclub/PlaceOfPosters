<script setup>
</script>

<template>
    <div class="text-center">
        start
    </div>

    <ClientOnly>
        {{ usePoster().load }}
    </ClientOnly>
</template>