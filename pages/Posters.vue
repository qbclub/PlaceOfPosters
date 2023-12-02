<script setup>
import { getData } from 'nuxt-storage/local-storage';
import { useRoute } from "vue-router";


let posterStore = usePoster()

const wrapper = ref(null)
const route = useRoute();
let locationsStore = useLocations()




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
 
    if (route.hash) {
      let id = route.hash.slice(1)
      document.getElementById(id)?.scrollIntoView()
    }
    wrapper.value.addEventListener("scroll", handleScroll);
  
    if (posterStore.posters.length == 0) {
      let filter
  
      if (getData('filterForm')) {
        filter = getData('filterForm')
      }
      if (!locationsStore.location.length) {
        if (getData('location')) {
          locationsStore.location = getData('location')
        }
      }
  
      posterStore.page = 1
      await posterStore.fetchPosters(filter)
    }
})
</script>

<template>


    <div class="wrapper" ref="wrapper" style="overflow-x: hidden;">
      <v-container class="pt-0 d-flex justify-center ">
        <v-row  class="justify-center flex-wrap mb-16 mt-2 w-100">
      
          <v-col v-for="item of posterStore.posters" :key="item._id" cols="6" sm="4" md="3" lg="2" class="pa-1">
            <PosterCard :poster="item" :id='item._id'/>
          </v-col>
        
        </v-row>
      </v-container>
      <v-row class="justify-center">
        <v-col>
          <h3 class="text-center" v-if="!posterStore.posters.length && posterStore.isLoaded"> Мы ничего не нашли 😟</h3>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col v-show="!posterStore.isLoaded" cols="12" sm="4" class="ma-0 pa-0"> <v-progress-linear indeterminate
            color="accent"></v-progress-linear></v-col>
  
      </v-row>
    </div>
  
  афиши
</template>

<style lang="scss" scoped>
.wrapper {

  height: 90dvh;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

</style>~/stores/poster~/stores/locations