<script setup>

import { useRouter } from 'vue-router'


let posterStore = usePoster()
let router = useRouter()
let locationsStore = useLocations()

let rerout = () => {
    router.push('/posters')
}

onMounted(async () => {
    window.setTimeout(rerout, 2000)
    if (posterStore.posters.length == 0) {
        let filter
        if (localStorage.getItem('filterForm')) {
            filter = JSON.parse(localStorage.getItem('filterForm'))
        }
        if (!locationsStore.location.length) {
            if (localStorage.getItem('location')) {
                locationsStore.location = localStorage.getItem('location')
            }
        }


        posterStore.page = 1
        await posterStore.fetchPosters(filter)
    }
})
</script>

<template>
    <v-container>
        <v-row cols="12">
            <v-col class="d-flex justify-center">
                <div class="hello-poster">
                    <img src="../assets/logo.webp" alt="">
                    <div class="hello-poster-text">
                        <div>
                            Место
                        </div>
                        <div>
                            для вашей
                        </div>
                        <div>
                            афиши
                        </div>
                    </div>



                </div>

            </v-col>
        </v-row>
    </v-container>
</template>
<style lang="scss" scoped>
.hello-poster {
    height: 70dvh;
    border-radius: 5px;
    aspect-ratio: 1/1.414213562;
    background: rgb(0, 0, 0, 0.4);
    position: relative;


    img {
        position: absolute;
        right: 40px;
        bottom: 40px;
        width: 40%;

    }

    .hello-poster-text {
        display: flex;
        height: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: clamp(1.875rem, 1.0938rem + 2.5vw, 2.5rem);
        font-weight: bold;
        color: white;
    }
}
</style>~/stores/poster~/stores/locations