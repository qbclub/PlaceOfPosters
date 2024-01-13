<script setup>

const { poster, isFrame } = defineProps(["poster", "isFrame"]);
let checkRout = () => {
  if (isFrame) {
    return '/framepost'
  } else {
    return '/post'
  }
}
</script>

<template>
  <div class="card rounded" @click="navigateTo(`${checkRout()}?_id=${poster._id}`)">
    <div class="img-container h-100">
      <img :srcset="poster.image" :src="poster.image" alt="" class="h-100 rounded" :class="{ hide: poster.isHidden }" loading="lazy"/>

    </div>
   
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

  .img-container {
    position: absolute;
    top: 0;
    left: 0;

    img {
      -webkit-transition: 0.5s ease;
      transition: 0.5s ease;

    }
  }

  .hide {
    filter: grayscale(100%);
  }

}

@media (min-width: 900px) {
  .card:hover .img-container img {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
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