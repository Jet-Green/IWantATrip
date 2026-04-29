<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import BackButton from "../components/BackButton.vue";
import { usePhotos } from "../stores/photos.js";

const router = useRouter()

const photosStore = usePhotos();
const getLocalImages = ref([])
const page = ref(1)

const backRoute = { name: 'Landing', hash: '#guide' };
const visible = ref(false);
const showMoreButton = ref(true);
const activePhoto = ref('')
const loading = ref(true)
const loadingMore = ref(false)

/** Ответ API: { urls, hasMore } или устаревший массив URL */
function parsePhotosPayload(res) {
    const d = res?.data
    if (d && Array.isArray(d.urls) && typeof d.hasMore === 'boolean') {
        return { urls: d.urls, hasMore: d.hasMore }
    }
    if (Array.isArray(d)) {
        return { urls: d, hasMore: d.length > 0 }
    }
    return { urls: [], hasMore: false }
}

const show = (index) => {
    visible.value = true
    activePhoto.value = getLocalImages.value[index]
}

const morePhotos = async () => {
    if (loadingMore.value) return
    loadingMore.value = true
    try {
        page.value++
        const res = await photosStore.getPhotos(page.value)
        const { urls: chunk, hasMore } = parsePhotosPayload(res)
        if (chunk.length) {
            getLocalImages.value = [...getLocalImages.value, ...chunk]
        }
        showMoreButton.value = chunk.length ? hasMore : false
    } finally {
        loadingMore.value = false
    }
}

onMounted(async () => {
    loading.value = true
    try {
        const res = await photosStore.getPhotos(page.value)
        const { urls, hasMore } = parsePhotosPayload(res)
        getLocalImages.value = urls
        showMoreButton.value = hasMore
    } catch {
        getLocalImages.value = []
        showMoreButton.value = false
    } finally {
        loading.value = false
    }
})
</script>
<template>
    <div class="photos-page">
        <BackButton :backRoute="backRoute" />
        <a-row class="d-flex justify-center">
            <a-col :xs="22" :lg="16">
                <div class="photos-page__title-row">
                    <h2 class="photos-page__title">Фотобанк</h2>
                    <a-button
                        type="primary"
                        shape="round"
                        class="photos-page__add-btn"
                        @click="router.push({ name: 'UploadPhotobank' })"
                    >
                        <span class="mdi mdi-plus photos-page__add-icon" aria-hidden="true"></span>
                        Добавить фото
                    </a-button>
                </div>
            </a-col>
            <a-col :xs="22" :lg="16">
                <a-spin :spinning="loading" tip="Загрузка…" size="large" class="photos-page__spin">
                    <div v-if="!loading && getLocalImages.length === 0" class="photos-page__empty" role="status">
                        Фото нет
                    </div>
                    <masonry-wall v-else-if="!loading && getLocalImages.length" class="masonry-wall"
                        :items="getLocalImages" :ssr-columns="1" :column-width="400" :gap="16">
                        <template #default="{ item, index }">
                            <div class="photos-page__tile">
                                <img :preview="{ visible: false }" :src="item" @click="show(index)" loading="lazy"
                                    alt="" />
                            </div>
                        </template>
                    </masonry-wall>
                    <div v-show="false" class="photos-page__preview-hidden">
                        <a-image-preview-group :preview="{ visible, onVisibleChange: vis => (visible = vis) }">
                            <a-image :src="activePhoto" />
                        </a-image-preview-group>
                    </div>
                </a-spin>
            </a-col>
            <a-col v-if="!loading && getLocalImages.length && showMoreButton" :xs="22" :lg="16"
                class="d-flex justify-center pa-32">
                <a-button shape="round" :loading="loadingMore" class="photos-page__more-btn" @click="morePhotos()">
                    ещё
                </a-button>
            </a-col>
        </a-row>
    </div>
</template>
<style lang="scss" scoped>
.photos-page {
    min-height: calc(100vh - 80px);
}

.photos-page__title-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px 16px;
    margin-bottom: 16px;
}

.photos-page__title {
    margin: 0;
    flex: 1 1 auto;
    min-width: 0;
}

.photos-page__add-btn.ant-btn {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 100px;
    padding-inline: 18px 22px;
}

.photos-page__add-icon {
    font-size: 18px;
    line-height: 1;
}

.photos-page__spin {
    width: 100%;
    min-height: 220px;
}

.photos-page__spin :deep(.ant-spin-container) {
    min-height: 180px;
}

.photos-page__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    padding: 48px 16px;
    font-size: 1.05rem;
    color: rgba(0, 0, 0, 0.45);
    text-align: center;
}

.photos-page__tile img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.photos-page__tile img:hover {
    opacity: 0.92;
    transform: scale(1.01);
}

.photos-page__preview-hidden {
    display: none;
}

.photos-page__more-btn.ant-btn {
    border-radius: 100px;
    padding-inline: 28px;
}

.ant-image-preview-mask {
    background-color: rgba(0, 0, 0, 1);
}
</style>
