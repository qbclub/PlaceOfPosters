<script setup>
import { useDisplay } from 'vuetify'
import { useRoute } from "vue-router";

let posterStore = usePoster()

const { mobile } = useDisplay()
let cols = ref('')

const wrapper = ref(null)
const route = useRoute();
let locationsStore = useLocations()
let showImage = ref(false)


definePageMeta({
  layout: 'frame'
})


let handleScroll = async () => {
  let triggerHeight =
    wrapper.value.scrollTop + wrapper.value.offsetHeight + 5
  if (triggerHeight >= wrapper.value.scrollHeight) {
    triggerHeight = wrapper.value.scrollHeight
  }
  if (triggerHeight == wrapper.value.scrollHeight) {
    await posterStore.fetchPosters(posterStore.filter)
  }
}

let radio = computed(() => {
  if (mobile.value) {

    return [{ label: 1, value: 12 }, { label: 2, value: 6 }, { label: 3, value: 4 }]
  } else {

    return [{ label: 3, value: 4 }, { label: 4, value: 3 }, { label: 6, value: 2 }, { label: 12, value: 1 }]
  }
})
let setCols = () => {
  mobile.value ? cols.value = "6" : cols.value = "3"
  if (localStorage.getItem("cols")) { cols.value = localStorage.getItem("cols") }
}

watch(cols, () => {
  localStorage.setItem("cols", cols.value)
})
watch(mobile, () => {
  mobile.value ? cols.value = "6" : cols.value = "3"
})

onMounted(async () => {
  await setCols()
  if (process.client) {
    if (route.hash) {
      let id = route.hash.slice(1)
      let el = document.getElementById(id)
      el?.scrollIntoView()
    }
  }
  if (process.client) {
    if (route.hash) {
      let id = route.hash.slice(1)
      let el = document.getElementById(id)
      el?.scrollIntoView()
    }

    let amount = Number(cols.value) * 3
    await Promise.all(posterStore.posters.map(async (poster, index) => {
      if (index > amount - 1) return
      await fetch(poster.image, { cache: "force-cache", mode: "no-cors" })
    }))
    showImage.value = true
  }


  wrapper.value.addEventListener("scroll", handleScroll);

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

    <div class="wrapper pa-2" ref="wrapper" style="overflow-x: hidden;">
      <ClientOnly>
      <!-- <ClientOnly>
   <v-radio-group inline class="d-flex justify-center" v-model="cols" color="accent">
        <v-radio v-for="item in radio" :value="item.value" label=""></v-radio>
      </v-radio-group>
</ClientOnly> -->

      <div class="pt-0 d-flex justify-center ">
        <v-row class="justify-center flex-wrap w-100 pa-1 pb-4">
          <!-- <v-fade-transition group leave-absolute hide-on-leave> -->
          <v-col v-for="item of posterStore.posters" :key="item._id" :cols="cols" class="pa-1">
            <PosterCard :poster="item" :id='item._id' :isFrame="true" :showImage="showImage" />
          </v-col>
          <!-- </v-fade-transition> -->
        </v-row>
      </div>
      <v-row class="justify-center">
        <v-col>
          <h3 class="text-center" v-if="!posterStore.posters.length && posterStore.isLoaded"> Мы ничего не нашли 😟</h3>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col v-show="!posterStore.isLoaded" cols="12" sm="4" class="ma-0 pa-0"> <v-progress-linear indeterminate
            color="accent"></v-progress-linear></v-col>

      </v-row>
    </ClientOnly>
    </div>

</template>

<style lang="scss" scoped>
.wrapper {

  height: 90dvh;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>