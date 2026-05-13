<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import BackButton from "../components/BackButton.vue";
import { usePhotos } from "../stores/photos.js";

const router = useRouter();

const photosStore = usePhotos();
/** @type {import('vue').Ref<Array<{ url: string; location: { name: string; shortName: string; type: string; coordinates: number[] } | null; placeNameText: string; enterpriseName: string; caption: string }>>} */
const photoItems = ref([]);
const page = ref(1);

const backRoute = { name: "Landing", hash: "#guide" };
const visible = ref(false);
const activePhoto = ref("");
const loading = ref(true);
const loadingMore = ref(false);
const showMoreButton = ref(true);

const mapDialogOpen = ref(false);
const mapDialogTitle = ref("Место на карте");
const mapDialogLon = ref(37.6176);
const mapDialogLat = ref(55.7558);
const mapPreviewContainer = ref(null);
/** @type {maplibregl.Map | null} */
let previewMap = null;
/** @type {maplibregl.Marker | null} */
let previewMarker = null;

function destroyPreviewMap() {
  if (previewMap) {
    previewMap.remove();
    previewMap = null;
  }
  previewMarker = null;
}

function initPreviewMap() {
  if (!mapPreviewContainer.value || previewMap) return false;
  const lon = mapDialogLon.value;
  const lat = mapDialogLat.value;
  previewMap = new maplibregl.Map({
    container: mapPreviewContainer.value,
    style: {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: [
            "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
            "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
            "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
          ],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors",
        },
      },
      layers: [{ id: "osm", type: "raster", source: "osm" }],
    },
    center: [lon, lat],
    zoom: 13,
  });

  previewMap.on("load", () => {
    previewMarker = new maplibregl.Marker({ color: "#ff6600" })
      .setLngLat([lon, lat])
      .addTo(previewMap);
    previewMap?.resize();
    requestAnimationFrame(() => previewMap?.resize());
    setTimeout(() => previewMap?.resize(), 280);
  });
  return true;
}

watch(mapDialogOpen, async (open) => {
  if (!open) {
    destroyPreviewMap();
    return;
  }
  await nextTick();
  await nextTick();
  if (!initPreviewMap()) {
    await nextTick();
    initPreviewMap();
  }
  await nextTick();
  previewMap?.resize();
  setTimeout(() => previewMap?.resize(), 200);
  setTimeout(() => previewMap?.resize(), 450);
});

/**
 * @param {{ location: { name?: string; coordinates: number[] } | null }} item
 */
function openMapDialog(item) {
  const loc = item.location;
  if (!loc?.coordinates || loc.coordinates.length < 2) return;
  const lon = Number(loc.coordinates[0]);
  const lat = Number(loc.coordinates[1]);
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return;
  mapDialogLon.value = lon;
  mapDialogLat.value = lat;
  mapDialogTitle.value = loc.name?.trim() || "Точка на карте";
  mapDialogOpen.value = true;
}

function hasMetaBelowPhoto(item) {
  return !!(
    item.location?.coordinates?.length === 2 ||
    item.placeNameText?.trim() ||
    item.enterpriseName?.trim() ||
    item.caption?.trim()
  );
}

function normalizePhotoItem(raw) {
  if (typeof raw === "string") {
    return {
      url: raw,
      location: null,
      placeNameText: "",
      enterpriseName: "",
      caption: "",
    };
  }
  const url = raw?.url != null ? String(raw.url) : "";
  const loc = raw?.location;
  const hasLoc =
    loc &&
    typeof loc === "object" &&
    loc.type === "Point" &&
    Array.isArray(loc.coordinates) &&
    loc.coordinates.length === 2;
  return {
    url,
    location: hasLoc
      ? {
          name: loc.name != null ? String(loc.name) : "",
          shortName: loc.shortName != null ? String(loc.shortName) : "",
          type: "Point",
          coordinates: [Number(loc.coordinates[0]), Number(loc.coordinates[1])],
        }
      : null,
    placeNameText: raw?.placeNameText != null ? String(raw.placeNameText).trim() : "",
    enterpriseName: raw?.enterpriseName != null ? String(raw.enterpriseName).trim() : "",
    caption: raw?.caption != null ? String(raw.caption).trim() : "",
  };
}

/** Ответ API: { items, urls, hasMore } или устаревший { urls, hasMore } / массив URL */
function parsePhotosPayload(res) {
  const d = res?.data;
  if (d && Array.isArray(d.items) && typeof d.hasMore === "boolean") {
    return { photos: d.items.map((x) => normalizePhotoItem(x)), hasMore: d.hasMore };
  }
  if (d && Array.isArray(d.urls) && typeof d.hasMore === "boolean") {
    return { photos: d.urls.map((url) => normalizePhotoItem(url)), hasMore: d.hasMore };
  }
  if (Array.isArray(d)) {
    return {
      photos: d.map((x) => normalizePhotoItem(typeof x === "string" ? x : x)),
      hasMore: d.length > 0,
    };
  }
  return { photos: [], hasMore: false };
}

const show = (index) => {
  visible.value = true;
  const row = photoItems.value[index];
  activePhoto.value = row?.url || "";
};

const morePhotos = async () => {
  if (loadingMore.value) return;
  loadingMore.value = true;
  try {
    page.value++;
    const res = await photosStore.getPhotos(page.value);
    const { photos: chunk, hasMore } = parsePhotosPayload(res);
    if (chunk.length) {
      photoItems.value = [...photoItems.value, ...chunk];
    }
    showMoreButton.value = chunk.length ? hasMore : false;
  } finally {
    loadingMore.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    const res = await photosStore.getPhotos(page.value);
    const { photos, hasMore } = parsePhotosPayload(res);
    photoItems.value = photos;
    showMoreButton.value = hasMore;
  } catch {
    photoItems.value = [];
    showMoreButton.value = false;
  } finally {
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  destroyPreviewMap();
});
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
          <div v-if="!loading && photoItems.length === 0" class="photos-page__empty" role="status">Фото нет</div>
          <masonry-wall
            v-else-if="!loading && photoItems.length"
            class="masonry-wall"
            :items="photoItems"
            :ssr-columns="1"
            :column-width="400"
            :gap="16"
          >
            <template #default="{ item, index }">
              <div
                class="photos-page__tile"
                :class="{ 'photos-page__tile--solo': !hasMetaBelowPhoto(item) }"
              >
                <img
                  :preview="{ visible: false }"
                  :src="item.url"
                  loading="lazy"
                  alt=""
                  @click="show(index)"
                />
                <div v-if="hasMetaBelowPhoto(item)" class="photos-page__meta">
                  <div
                    v-if="item.location?.coordinates?.length === 2"
                    class="photos-page__meta-loc"
                    role="button"
                    tabindex="0"
                    :title="'Показать на карте'"
                    @click.stop="openMapDialog(item)"
                    @keydown.enter.prevent.stop="openMapDialog(item)"
                  >
                    <div class="photos-page__meta-line">
                      {{ item.location.name?.trim() || "Точка на карте" }}
                    </div>
                    <div class="photos-page__meta-line photos-page__meta-line--coords">
                      {{ Number(item.location.coordinates[0]).toFixed(4) }},
                      {{ Number(item.location.coordinates[1]).toFixed(4) }}
                    </div>
                  </div>
                  <div v-if="item.placeNameText?.trim()" class="photos-page__meta-line">
                    Место (текст): {{ item.placeNameText.trim() }}
                  </div>
                  <div v-if="item.enterpriseName?.trim()" class="photos-page__meta-line">
                    Предприятие: {{ item.enterpriseName.trim() }}
                  </div>
                  <div v-if="item.caption?.trim()" class="photos-page__meta-line">{{ item.caption.trim() }}</div>
                </div>
              </div>
            </template>
          </masonry-wall>
          <div v-show="false" class="photos-page__preview-hidden">
            <a-image-preview-group :preview="{ visible, onVisibleChange: (vis) => (visible = vis) }">
              <a-image :src="activePhoto" />
            </a-image-preview-group>
          </div>
        </a-spin>
      </a-col>
      <a-col
        v-if="!loading && photoItems.length && showMoreButton"
        :xs="22"
        :lg="16"
        class="d-flex justify-center pa-32"
      >
        <a-button shape="round" :loading="loadingMore" class="photos-page__more-btn" @click="morePhotos()">
          ещё
        </a-button>
      </a-col>
    </a-row>

    <a-modal
      v-model:open="mapDialogOpen"
      :title="mapDialogTitle"
      width="min(720px, 94vw)"
      wrap-class-name="photos-page-map-modal"
      :footer="null"
      destroy-on-close
    >
      <p class="photos-page-map-dialog__hint">
        Координаты: {{ mapDialogLon.toFixed(5) }}, {{ mapDialogLat.toFixed(5) }}
      </p>
      <div ref="mapPreviewContainer" class="photos-page-map-dialog__map"></div>
    </a-modal>
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
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.photos-page__tile--solo img {
  border-radius: 8px;
}

.photos-page__tile img:hover {
  opacity: 0.92;
  transform: scale(1.01);
}

.photos-page__meta {
  margin-top: 0;
  padding: 10px 10px 12px;
  background: rgba(18, 32, 51, 0.04);
  border-radius: 0 0 8px 8px;
  border: 1px solid rgba(18, 32, 51, 0.08);
  border-top: none;
}

.photos-page__meta-line {
  font-size: 13px;
  line-height: 1.4;
  color: rgba(18, 32, 51, 0.88);
  word-break: break-word;
}

.photos-page__meta-line + .photos-page__meta-line {
  margin-top: 4px;
}

.photos-page__meta-line--muted {
  font-size: 12px;
  color: rgba(18, 32, 51, 0.55);
}

.photos-page__meta-loc {
  cursor: pointer;
  padding: 4px 6px;
  margin: -4px -6px 4px;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.photos-page__meta-loc:hover {
  background: rgba(255, 102, 0, 0.1);
}

.photos-page__meta-loc:focus-visible {
  outline: 2px solid rgba(255, 102, 0, 0.65);
  outline-offset: 1px;
}

.photos-page__meta-line--coords {
  font-size: 12px;
  color: rgba(18, 32, 51, 0.55);
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

<style lang="scss">
/* модалка в body */
.photos-page-map-modal .photos-page-map-dialog__hint {
  margin: 0 0 10px;
  font-size: 13px;
  color: rgba(18, 32, 51, 0.75);
}

.photos-page-map-modal .photos-page-map-dialog__map {
  width: 100%;
  height: min(52vh, 420px);
  min-height: 280px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 102, 0, 0.45);
}
</style>
