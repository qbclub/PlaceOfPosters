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
   
      <v-img :src="poster.image" alt="Изображение не загрузилось" cover class="h-100 rounded" ></v-img>

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