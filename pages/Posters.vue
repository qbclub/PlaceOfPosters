<script setup>
// import { ref, onMounted, onBeforeMount, onUpdated } from 'vue';
// import { useRoute } from "vue-router";
// // import PosterCard from './PosterCard.vue';
// import { usePoster } from '@/store/poster';
// import { useLocations } from '@/store/locations';
// import { computed } from 'vue';
// let posterStore = usePoster()

// const wrapper = ref(null)
// const route = useRoute();
// let locationsStore = useLocations()
// let imgOnload = ref(false)

// let isLoad = () => {
//   imgOnload.value = true
// }

// let handleScroll = async () => {
//   let triggerHeight =
//     wrapper.value.scrollTop + wrapper.value.offsetHeight + 5
//   if (triggerHeight >= wrapper.value.scrollHeight) {
//     triggerHeight = wrapper.value.scrollHeight
//   }
//   if (triggerHeight == wrapper.value.scrollHeight) {
//     await posterStore.fetchPosters(posterStore.filter)
//   }
// }

// let blur = (date) => {
//   let isDateOut
//   if (date?.length) {
//     for (let i = 0; i < date.length; i++) {
//       if (date[i] < new Date().setHours(0, 0, 0, 0)) {
//         isDateOut = true
//       } else {
//         return false
//       }
//     }
//   } else {
//     return false
//   }
//   return isDateOut
// }

// onMounted(async () => {
//   if (route.hash) {
//     let id = route.hash.slice(1)
//     document.getElementById(id)?.scrollIntoView()
//   }
//   wrapper.value.addEventListener("scroll", handleScroll);

//   if (posterStore.posters.length == 0) {
//     let filter
//     if (localStorage.getItem('filterForm')) {
//       filter = JSON.parse(localStorage.getItem('filterForm'))
//     }
//     if (!locationsStore.location.length) {
//       if (localStorage.getItem('location')) {
//         locationsStore.location = localStorage.getItem('location')
//       }
//     }

//     posterStore.page = 1
//     await posterStore.fetchPosters(filter)
//   }


// });
// onBeforeMount(() => {
//   window.addEventListener("load", isLoad());
// }
// )
// onUpdated(() => {
//   window.addEventListener("load", isLoad());
// })
</script>

<template>

    <PosterCard/>
  <div class="wrapper" ref="wrapper" style="overflow-x: hidden;">
    <v-container class="pt-0 d-flex justify-center ">
      <v-row v-show="imgOnload" class="justify-center flex-wrap mb-16 mt-2 w-100">
    
        <v-col v-for="item of posterStore.posters" :key="item._id" cols="6" sm="4" md="3" lg="2" class="pa-1">
          <PosterCard :poster="item" :id='item._id' :class="{ blur: blur(item.date) }" />
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
</template>

<style lang="scss" scoped>
.wrapper {

  height: 90dvh;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.blur {
  filter: grayscale(100%);
}
</style>