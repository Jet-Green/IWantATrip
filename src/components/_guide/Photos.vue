<script setup>
import { ref, onMounted, watch } from 'vue'
import BackButton from "../BackButton.vue";
import { usePhotos } from "../../stores/photos.js";
const photosStore = usePhotos();
let getLocalImages = ref([])

const backRoute = { name: 'Landing', hash: '#guide' };
const visible = ref(false);
let activePhoto = ref('')
let show = (index) => {
    visible.value = true
    activePhoto.value = getLocalImages.value[index]

}

onMounted(async () => {
    let res = await photosStore.getPhotos()
    getLocalImages.value = res.data

})

</script>
<template>
    <div>
        <BackButton :backRoute="backRoute" />
        <a-row class="d-flex justify-center">
            <a-col :xs="22" :lg="16">
                <h3>Фотографии</h3>
            </a-col>
            <a-col :xs="22" :lg="16">
                <masonry-wall :items="getLocalImages" :ssr-columns="1" :column-width="200" :gap="8">
                    <template #default="{ item, index }">
                        <div>
                            <img :preview="{ visible: false }" :src="item" @click="show(index)"
                            loading="lazy"  />
                        </div>
                    </template>
                </masonry-wall>
                <div style="display: none; ">
                    <a-image-preview-group :preview="{ visible, onVisibleChange: vis => (visible = vis) }">
                        <a-image :src="activePhoto"  />
                    </a-image-preview-group>
                </div>
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