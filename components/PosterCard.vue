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

  <div class="card rounded " @click="navigateTo(`${checkRout()}?_id=${poster._id}`)">
   
    <v-img class="h-100" :src="poster.image" cover :class="{ hide: poster.isHidden }">
      <!-- <img :srcset="poster.image"  loading="lazy" alt="" class="h-100 rounded" :class="{ hide: poster.isHidden }"/> -->

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


.card-front {
  position: absolute;
  cursor: pointer;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
</style>