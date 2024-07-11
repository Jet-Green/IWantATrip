<script setup>
import { ref, onMounted } from 'vue'

import BackButton from "../BackButton.vue";
import { usePhotos } from "../../stores/photos.js";

const photosStore = usePhotos();
let getLocalImages = ref([])
let page = ref(1)

const backRoute = { name: 'Landing', hash: '#guide' };
const visible = ref(false);
const showMoreButton = ref(true);
let activePhoto = ref('')
let show = (index) => {
    visible.value = true
    activePhoto.value = getLocalImages.value[index]
}
let morePhotos = async () => {
    page.value++
    let res = await photosStore.getPhotos(page.value)
    if (res.data.length) {
        getLocalImages.value = [...getLocalImages.value, ...res.data];
    } else {
        showMoreButton.value = false
    }
}


onMounted(async () => {
    let res = await photosStore.getPhotos(page.value)
    getLocalImages.value = res.data 
})

</script>
<template>
    <div>
        <BackButton :backRoute="backRoute" />
        <a-row class="d-flex justify-center">
            <a-col :xs="22" :lg="16">
                <h2>Фотобанк</h2>
            </a-col>
            <a-col :xs="22" :lg="16">
                <masonry-wall class="masonry-wall" :items="getLocalImages" :ssr-columns="1" :column-width="200"
                    :gap="8">
                    <template #default="{ item, index }">
                        <div>
                            <img :preview="{ visible: false }" :src="item" @click="show(index)" loading="lazy" />
                        </div>
                    </template>
                </masonry-wall>
                <div style="display: none; ">
                    <a-image-preview-group :preview="{ visible, onVisibleChange: vis => (visible = vis) }">
                        <a-image :src="activePhoto" />
                    </a-image-preview-group>
                </div>
            </a-col>
            <a-col :xs="22" :lg="16" class="d-flex justify-center pa-32" v-if="showMoreButton">
                <a-button @click="morePhotos()">ещё</a-button>
            </a-col>

        </a-row>
    </div>

</template>
<style lang="scss" scoped>
img {
    width: 100%;
    height: auto;
}

.ant-image-preview-mask {

    background-color: rgba(0, 0, 0, 1);
}
</style>