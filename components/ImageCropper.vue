<script setup>
import { ref, watch } from 'vue'
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";

let loadedImages = ref([]);
let preview = ref({});
let previewImage = ref(null);
let imageInput = ref(null)
let cropper;

const emit = defineEmits(["addImage"]);

function loadImage() {
    loadedImages.value = imageInput.value.files;
    // console.log(loadedImages.value[0].originFileObj);
    if (loadedImages.value.length) {
        let reader = new FileReader();
        reader.onloadend = () => {
            preview.value = { img: reader.result, name: loadedImages.value[0].name };
            previewImage.value.src = preview.value.img;
        };
        reader.readAsDataURL(loadedImages.value[0]);
    } else {
        preview.value = null;
    }
}
async function crop() {
    if (cropper) {
        await cropper
            .getCroppedCanvas({
                fillColor: "#fff",
                width: 450,
                // height: 425,
                // imageSmoothingEnabled: false,
                // imageSmoothingQuality: 'low',
            })
            .toBlob((blob) => {
                emit("addImage", blob);
                try {
                    loadedImages.value = [];
                } catch (err) {
                    console.log(err);
                }
            }, 'image/jpeg', 0.95
                // quality is
                // 0.9,
            )
    }
}
watch(preview, () => {
    cropper = new Cropper(previewImage.value, {
        aspectRatio: 210 / 297,
        maxContainerWidth: 300,
        maxContainerHeight: 300,
        minContainerWidth: 300,
        minContainerHeight: 300,
        // minCanvasWidth: 300,
        // maxCanvasWidth: 300,
        // minCanvasHeight: 300,
        // maxCanvasHeight: 300,
        guides: true,
        center: true,
        // crop(event) {
        //     // croppedImage = event.target.currentSrc;
        //     console.log(event);
        // }
        // ready: function () {
        //     console.log('ready');
        //     cropperReady.value = true;
        // },
    });
});
</script>
<template>
    <h3 class="mb-2 text-center">Обработка фотографии</h3>
    <div class="pa-4">
        <input type="file" accept="image/*" ref="imageInput" id="upload" @change="loadImage" style="display: none">

        <v-row>
            <v-col cols="12" class="pa-0">
                <img v-if="loadedImages.length" ref="previewImage" style="width: 50vw; height: 50vh" />
                <div style="width: 50vw"></div>
                <label for="upload">
                    <div v-if="!loadedImages.length" class="d-flex justify-center align-center flex-column"
                        style="height: 50vh; cursor: pointer">
                        <span class="mdi mdi-24px mdi-camera"></span>
                        <span> выбери фото</span>
                    </div>
                </label>
            </v-col>
            <v-col cols="12">
                <div class="d-flex justify-center" v-if="loadedImages.length">
                    <v-btn @click="crop" color="accent"> Обрезать </v-btn>
                </div>
            </v-col>
        </v-row>
    </div>
</template>