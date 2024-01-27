<script setup>
import { useDisplay } from 'vuetify'
import { useRoute } from "vue-router";
let locationsStore = useLocations()
let posterStore = usePoster()
let cols = ref(3)
let loading = ref(false)
let topVisible = ref(false)

let route = useRoute()

const { mobile } = useDisplay()

const wrapper = ref(null)

let radio = computed(() => {
  if (mobile.value) {
    return [{ label: 1, value: "12" }, { label: 2, value: "6" }, { label: 3, value: "4" }]
  } else {
    return [{ label: 3, value: "4" }, { label: 4, value: "3" }, { label: 6, value: "2" }, { label: 12, value: "1" }]
  }
})




let handleScroll = async () => {
  let triggerHeight =
    wrapper.value.scrollTop + wrapper.value.offsetHeight + 5
  if (triggerHeight >= 1500) {
    topVisible.value = true
  }
  else {
    topVisible.value = false
  }
  if (triggerHeight >= wrapper.value.scrollHeight) {
    triggerHeight = wrapper.value.scrollHeight
  }
  if (triggerHeight == wrapper.value.scrollHeight) {
    await posterStore.fetchPosters(posterStore.filter)
  }
}

let setCols = () => {
  if (process.client) {
    mobile.value ? cols.value = "6" : cols.value = "3"
    if (localStorage.getItem("cols")) { cols.value = localStorage.getItem("cols") }
  }
}
let goToTop = () => {
  wrapper.value.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}
watch(cols, () => {
  localStorage.setItem("cols", cols.value)
})
//это что?
// watch(mobile, value => {
//   value ? cols.value = "6" : cols.value = "3"
// })
watch(mobile, () => {
  mobile.value ? cols.value = "6" : cols.value = "3"
})


onMounted(async () => {
  await setCols()
  await posterStore.fetchPosters(posterStore.filter)
  if (process.client) {
    if (route.hash) {
      let id = route.hash.slice(1)
      let el = document.getElementById(id)
      el?.scrollIntoView()
    }
  }
  wrapper.value.addEventListener("scroll", handleScroll);
})
useNuxtApp().hook('page:finish', () => loading.value = true)
</script>

<template>
  <div class="wrapper" ref="wrapper" style="overflow-x: hidden;">
    <v-container class="pa-0 d-flex justify-center ">
      <v-row class="pa-0 ma-0 d-flexjustify-space-between ">
        <div style="width: 80px"></div>
        <v-radio-group inline class="d-flex justify-center" v-model="cols" color="accent">
          <v-radio v-for="item in radio" :value="item.value" label=""></v-radio>
        </v-radio-group>
        <div class="text-center">
          <a href="https://t.me/plporu" target="_blank">
            <img class="ma-2" src="~/assets/icons/telegram.svg" alt=""></a>

          <a href="https://vk.com/plporu" target="_blank"><img class="ma-2" src="~/assets/icons/vk.svg" alt=""></a>

        </div>
      </v-row>
    </v-container>



    <v-container class="pt-0 d-flex justify-center " v-if="loading">
      <v-row class="justify-center flex-wrap mb-16 mt-2 w-100">

        <v-col v-for="item of posterStore.posters" :key="item._id" :cols="cols" class="pa-1">
          <PosterCard :poster="item" :id='item._id' />
        </v-col>

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
<Transition name="move">
    <v-btn v-if="topVisible" @click="goToTop" icon="mdi-chevron-double-up" color="accent"
      class="topbtn d-none d-md-block">
    </v-btn>
  </Transition>
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

.topbtn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.move-enter-active,
.move-leave-active {
  transition: all 0.2s ease-out;
}

.move-enter-from,
.move-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>