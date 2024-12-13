<script setup>

const { poster, isFrame, showImage } = defineProps(["poster", "isFrame", "showImage"]);
let checkRout = () => {

  if (isFrame) {
    return '/framepost'
  } else {
    return '/post'
  }
}


</script>

<template>

  <div class="card rounded " @click="navigateTo(`${checkRout()}?_id=${poster._id}`)" >
   
    <v-img class="h-100" :src="poster.image" loading="lazy" cover :class="{ hide: poster.isHidden }" v-if="showImage" alt="Изображение не загрузилось">
      <!-- <img :srcset="poster.image"  loading="lazy" alt="" class="h-100 rounded" :class="{ hide: poster.isHidden }"/> -->
      <!-- <v-img class="h-100" :src="poster.image" cover v-if="!poster.isHidden"> -->

    </v-img>

  </div>
</template>

<style scoped lang="scss">
.card {
  width: 100%;
  cursor: pointer;
  box-sizing: border-box;
  aspect-ratio: 1/1.414213562;
  background-color: transparent;
  position: relative;
  overflow: hidden;
  -webkit-transition: 0.5s ease;
  transition: 0.5s ease;
}



.hide {
  filter: grayscale(100%);
}

@media (min-width: 900px) {
  .card:hover {
    -webkit-transform: scale(0.95);
    transform: scale(0.95);
  }
}



</style>