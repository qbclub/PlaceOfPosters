<script setup>
import { useDisplay } from 'vuetify'
import { useRoute } from "vue-router";

let posterStore = usePoster()

let filter = useCookie('filterForm')
filter.value = filter.value ?? {}
await posterStore.fetchPosters(filter.value)

let route = useRoute()

const { mobile } = useDisplay()
let cols = useCookie('cols')
cols.value = cols.value ?? '3'

let radio = computed(() => {
  if (mobile.value) {
    return [{ label: 1, value: "12" }, { label: 2, value: "6" }, { label: 3, value: "4" }]
  } else {
    return [{ label: 3, value: "4" }, { label: 4, value: "3" }, { label: 6, value: "2" }, { label: 12, value: "1" }]
  }
})

watch(mobile, value => {
  value ? cols.value = "6" : cols.value = "3"
})


const wrapper = ref(null)

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

onMounted(async () => {
  cols.value = mobile.value ? "6" : "3"

  if (process.client) {
    if (route.hash) {
      let id = route.hash.slice(1)
      let el = document.getElementById(id)
      el?.scrollIntoView()
    }
  }

  wrapper.value.addEventListener("scroll", handleScroll);
})
</script>

<template>
  <div class="wrapper" ref="wrapper" style="overflow-x: hidden;">
    <v-radio-group inline class="d-flex justify-center" v-model="cols" color="accent">
      <v-radio v-for="item in radio" :value="item.value" label=""></v-radio>
    </v-radio-group>

    <v-container class="pt-0 d-flex justify-center ">
      <v-row class="justify-center flex-wrap mb-16 mt-2 w-100">
        <v-fade-transition group leave-absolute hide-on-leave>
          <v-col v-for="item of posterStore.posters" :key="item._id" :cols="cols" class="pa-1">
            <PosterCard :poster="item" :id='item._id' />
          </v-col>
        </v-fade-transition>
      </v-row>
    </v-container>

    <v-row class="justify-center">
      <v-col>
        <h3 class="text-center" v-if="!posterStore.posters.length && posterStore.isLoaded"> Мы ничего не нашли 😟</h3>
      </v-col>
    </v-row>

    <v-row class="justify-center">
      <v-col v-show="!posterStore.isLoaded" cols="12" sm="4" class="ma-0 pa-0"> 
        <v-progress-linear indeterminate color="accent" />
      </v-col>
    </v-row>
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