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
                width: 300,
                height: 300,
                // imageSmoothingEnabled: false,
                // imageSmoothingQuality: 'low',
            })
            .toBlob((blob) => {
                emit("addImage", blob);
                try {
                    cropper.destroy()
                    loadedImages.value = [];
                } catch (err) {
                    console.log(err);
                }
            })
    }
}
watch(preview, () => {
    cropper = new Cropper(previewImage.value, {
        aspectRatio: 270/175,
        maxContainerWidth: 300,
        maxContainerHeight: 300,
        minContainerWidth: 300,
        minContainerHeight: 300,
        // minCanvasWidth: 500,
        // maxCanvasWidth: 500,
        // minCanvasHeight: 500,
        // maxCanvasHeight: 500,
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
        cropend(cropper) {
            cropper.destroy();
        }
    });
});
</script>
<template>
    <h3 class="mb-2 text-center">Обработка фотографии</h3>
    <div class="pa-4">
        <input type="file" accept="image/*" ref="imageInput" id="upload" @change="loadImage" style="display: none">

        <div class="d-flex justify-center" v-if="loadedImages.length">
            <a-button @click="crop" class="ma-4"> Обрезать </a-button>
        </div>

        <a-row>
            <a-col :span="24" class="pa-0">
                <img v-if="loadedImages.length" ref="previewImage" style="width: 50vw; height: 50vh" />
                <div style="width: 50vw"></div>
                <label for="upload">
                    <div v-if="!loadedImages.length" class="d-flex justify-center align-center flex-column"
                        style="height: 50vh; cursor: pointer">
                        <span class="mdi mdi-24px mdi-camera"></span>
                        <span> выбери фото</span>
                    </div>
                </label>
            </a-col>
        </a-row>
    </div>
</template>