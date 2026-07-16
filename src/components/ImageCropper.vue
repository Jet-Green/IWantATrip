<script setup>
import { ref, watch, nextTick } from 'vue'
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";

let loadedImages = ref([]);
let preview = ref({});
let previewImage = ref(null);
let imageInput = ref(null)
let cropper;

const emit = defineEmits(["addImage"]);
const props = defineProps({
    aspectRatio: Number,
    // Необязательный URL изображения (например, фото из фотобанка).
    // Если задан — кроппер грузит его напрямую, минуя выбор файла.
    src: String,
})

function destroyCropper() {
    if (cropper) {
        try { cropper.destroy() } catch (err) { /* ignore */ }
        cropper = null;
    }
}

function initCropper() {
    if (!previewImage.value) return;
    destroyCropper();
    cropper = new Cropper(previewImage.value, {
        aspectRatio: props.aspectRatio ?? 270 / 175,
        maxContainerWidth: 300,
        maxContainerHeight: 300,
        minContainerWidth: 300,
        minContainerHeight: 300,
        guides: true,
        center: true,
        checkCrossOrigin: true,
    });
}

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
                width: 500,
                height: 500,
                // imageSmoothingEnabled: false,
                // imageSmoothingQuality: 'low',
            })
            .toBlob((blob) => {
                emit("addImage", blob);
                destroyCropper();
                loadedImages.value = [];
            }, 'image/jpeg',
                // quality is
                // 0.9,
            )
    }
}
watch(preview, () => {
    initCropper();
});

// Режим URL: подгружаем удалённое изображение (фотобанк) в тот же кроппер.
// Требует включённого CORS на бакете, чтобы холст не был "tainted" при экспорте.
watch(
    () => props.src,
    async (url) => {
        if (!url) {
            destroyCropper();
            return;
        }
        await nextTick();
        const img = previewImage.value;
        if (!img) return;
        destroyCropper();
        img.crossOrigin = 'anonymous';
        img.onload = () => initCropper();
        img.src = url;
        // если картинка уже в кеше и onload не сработает — инициализируем сразу
        if (img.complete && img.naturalWidth) initCropper();
    },
    { immediate: true }
);
</script>
<template>
    <h3 class="mb-2 text-center">Обработка фотографии</h3>
    <div class="pa-4">
        <input type="file" accept="image/*" ref="imageInput" id="upload" @change="loadImage" style="display: none">

        <div class="d-flex justify-center" v-if="loadedImages.length || src">
            <a-button @click="crop" class="ma-4"> Обрезать </a-button>
        </div>

        <a-row>
            <a-col :span="24" class="pa-0">
                <img v-if="loadedImages.length || src" ref="previewImage" style="width: 50vw; height: 50vh" alt="not found"/>
                <div style="width: 50vw"></div>
                <label for="upload">
                    <div v-if="!loadedImages.length && !src" class="d-flex justify-center align-center flex-column"
                        style="height: 50vh; cursor: pointer">
                        <MdiIcon name="camera" size="24px" />
                        <span> выбери фото</span>
                    </div>
                </label>
            </a-col>
        </a-row>
    </div>
</template>
