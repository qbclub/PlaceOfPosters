<script setup>
import { useDisplay } from 'vuetify'
import { useRoute } from "vue-router";
useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://plpo.ru'
    }
  ]
})
let locationsStore = useLocations()
let posterStore = usePoster()
let cols = ref(3)
let loading = ref(false)
let topVisible = ref(false)
let showImage = ref(false)


let route = useRoute()

const { mobile } = useDisplay()

const wrapper = ref(null)

const iconSquareTrue = "M4 4H20V20H4Z";
const iconSquareFalse = "M4 4H20V20H4V4Z";
const iconGrid2x2True = "M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H20V20H14V14Z";
const iconGrid2x2False = "M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H20V20H14V14ZM10 4V10M14 4V10M4 10H10M14 10H20M10 14V20M14 14V20M10 10V14M14 10V14";
const iconGrid3x3True = 'M4 4H8V8H4V4ZM4 10H8V14H4V10ZM4 16H8V20H4V16ZM10 4H14V8H10V4ZM10 10H14V14H10V10ZM10 16H14V20H10V16ZM16 4H20V8H16V4ZM16 10H20V14H16V10ZM16 16H20V20H16V16Z'
const iconGrid3x3False = 'M4 4H8V8H4V4ZM4 10H8V14H4V10ZM4 16H8V20H4V16ZM10 4H14V8H10V4ZM10 10H14V14H10V10ZM10 16H14V20H10V16ZM16 4H20V8H16V4ZM16 10H20V14H16V10ZM16 16H20V20H16V16Z'
const iconGrid4x4True = 'M2 2H5V5H2V2ZM2 7H5V10H2V7ZM2 12H5V15H2V12ZM2 17H5V20H2V17ZM7 2H10V5H7V2ZM7 7H10V10H7V7ZM7 12H10V15H7V12ZM7 17H10V20H7V17ZM12 2H15V5H12V2ZM12 7H15V10H12V7ZM12 12H15V15H12V12ZM12 17H15V20H12V17ZM17 2H20V5H17V2ZM17 7H20V10H17V7ZM17 12H20V15H17V12ZM17 17H20V20H17V17Z'
const iconGrid4x4False = 'M2 2H5V5H2V2ZM7 2H10V5H7V2ZM12 2H15V5H12V2ZM17 2H20V5H17V2ZM2 7H5V10H2V7ZM7 7H10V10H7V7ZM12 7H15V10H12V7ZM17 7H20V10H17V7ZM2 12H5V15H2V12ZM7 12H10V15H7V12ZM12 12H15V15H12V12ZM17 12H20V15H17V12ZM2 17H5V20H2V17ZM7 17H10V20H7V17ZM12 17H15V20H12V17ZM17 17H20V20H17V17Z'

let radio = computed(() => {
  if (mobile.value) {
    return [{ label: 1, value: "12", trueIcon: iconSquareTrue, falseIcon: iconSquareFalse }, 
            { label: 2, value: "6", trueIcon: iconGrid2x2True, falseIcon: iconGrid2x2False }, 
            { label: 3, value: "4", trueIcon: iconGrid3x3True, falseIcon: iconGrid4x4False }]
  } else {
    return [{ label: 3, value: "4", trueIcon: iconSquareTrue, falseIcon: iconSquareFalse }, 
            { label: 4, value: "3", trueIcon: iconGrid2x2True, falseIcon: iconGrid2x2False }, 
            { label: 6, value: "2", trueIcon: iconGrid3x3True, falseIcon: iconGrid3x3False }, 
            { label: 12, value: "1", trueIcon: iconGrid4x4True, falseIcon: iconGrid4x4False }]
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


    const initialLength = posterStore.posters.length;

    // Загружаем новые постеры
    await posterStore.fetchPosters(posterStore.filter);

    // Получаем только новые постеры
    const newPosters = posterStore.posters.slice(initialLength);

    // Прелоадим изображения для новых постеров
    await preloadImages(newPosters)
    showImage.value = true; // Показываем изображения

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

const preloadImages = async (posters) => {
  const imagePromises = posters.map((poster) => {
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        resolve(false); // Считаем ошибкой, если загрузка заняла больше 100 мс
      }, 100);

      img.src = poster.image;
      img.onload = () => {
        clearTimeout(timeout); // Успешно загрузилось
        resolve(true);
      };
      img.onerror = () => {
        clearTimeout(timeout); // Произошла ошибка загрузки
        resolve(false);
      };
    });
  });
  
  // Ждем завершения всех загрузок, но не блокируем отображение
  await Promise.allSettled(imagePromises);
};

watch(cols, () => {
  localStorage.setItem("cols", cols.value)
})

watch(mobile, () => {
  mobile.value ? cols.value = "6" : cols.value = "3"
})



onMounted(async () => {
  setCols()
  await posterStore.fetchPosters(posterStore.filter)
  if (process.client) {
    if (route.hash) {
      let id = route.hash.slice(1)
      let el = document.getElementById(id)
      el?.scrollIntoView()
    }

    await preloadImages(posterStore.posters);
    showImage.value = true; // Показываем изображения после загрузки
  }
  wrapper.value.addEventListener("scroll", handleScroll);
})


</script>

<template>
  <div class="wrapper" ref="wrapper" style="overflow-x: hidden;">
    <v-container class="pa-0 d-flex justify-center ">
      <v-row class="pa-0 ma-0 d-flexjustify-space-between ">
        <div style="width: 80px"></div>
        <v-radio-group inline class="d-flex justify-center" v-model="cols" color="accent">
          <v-radio v-for="item in radio" :value="item.value" :trueIcon="`mdiSvg:${item.trueIcon}`" :falseIcon="`mdiSvg:${item.falseIcon}`" label=""></v-radio>
        </v-radio-group>
        <div class="text-center">
          <a href="https://t.me/plporu" target="_blank">
            <img class="ma-2" src="~/assets/icons/telegram.svg" alt="Изображение не загрузилось"></a>

          <a href="https://vk.com/plporu" target="_blank"><img class="ma-2" src="~/assets/icons/vk.svg"
              alt="Изображение не загрузилось"></a>

        </div>
      </v-row>
    </v-container>



    <v-container class="pt-0 d-flex justify-center ">
      <h1>СВО</h1><v-icon :icon="`mdiSvg:${iconGrid3x3False}`" />

      <v-row class="justify-center flex-wrap mb-16 mt-2 w-100">

        <v-col v-for="item of posterStore.posters" :key="item._id" :cols="cols" class="pa-1 poster">
          <PosterCard :poster="item" :id='item._id' :showImage="showImage" />
        </v-col>

      </v-row>
    </v-container>

    <v-row class="justify-center">
      <v-col>
        <h3 class="text-center" v-if="!posterStore.posters.length && posterStore.isLoaded"> Мы ничего не нашли 😟</h3>
      </v-col>
    </v-row>

    <v-row class="justify-center">
      <v-col v-show="!showImage" cols="12" sm="4" class="ma-0 pa-0">
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