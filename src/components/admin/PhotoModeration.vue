<script setup>
import BackButton from "../BackButton.vue";
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { usePhotos } from "../../stores/photos";

const route = useRoute();
const router = useRouter();
const photosStore = usePhotos();

/** @type {import('vue').Ref<{ url: string; _id: string; location: object | null; placeNameText: string; enterpriseName: string; caption: string; status?: string; moderationMessage?: string; author?: object }>} */
const photo = ref({
  url: "",
  _id: "",
  location: null,
  placeNameText: "",
  enterpriseName: "",
  caption: "",
});
const isPublished = ref(false);
const isLoading = ref(false);
const moderationMessage = ref("");
const pageLoading = ref(true);

const mapDialogOpen = ref(false);
const mapDialogTitle = ref("Место на карте");
const mapDialogLon = ref(37.6176);
const mapDialogLat = ref(55.7558);
const mapPreviewContainer = ref(null);
/** @type {maplibregl.Map | null} */
let previewMap = null;
/** @type {maplibregl.Marker | null} */
let previewMarker = null;

function normalizePhotoItem(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      url: "",
      location: null,
      placeNameText: "",
      enterpriseName: "",
      caption: "",
    };
  }
  const url = raw.url != null ? String(raw.url) : "";
  const loc = raw.location;
  const hasLoc =
    loc &&
    typeof loc === "object" &&
    loc.type === "Point" &&
    Array.isArray(loc.coordinates) &&
    loc.coordinates.length === 2;
  return {
    ...raw,
    url,
    location: hasLoc
      ? {
          name: loc.name != null ? String(loc.name) : "",
          shortName: loc.shortName != null ? String(loc.shortName) : "",
          type: "Point",
          coordinates: [Number(loc.coordinates[0]), Number(loc.coordinates[1])],
        }
      : null,
    placeNameText: raw.placeNameText != null ? String(raw.placeNameText).trim() : "",
    enterpriseName: raw.enterpriseName != null ? String(raw.enterpriseName).trim() : "",
    caption: raw.caption != null ? String(raw.caption).trim() : "",
  };
}

function hasMetaBelowPhoto(item) {
  return !!(
    item.location?.coordinates?.length === 2 ||
    item.placeNameText?.trim() ||
    item.enterpriseName?.trim() ||
    item.caption?.trim()
  );
}

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

function openMapDialog() {
  const loc = photo.value.location;
  if (!loc?.coordinates || loc.coordinates.length < 2) return;
  const lon = Number(loc.coordinates[0]);
  const lat = Number(loc.coordinates[1]);
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return;
  mapDialogLon.value = lon;
  mapDialogLat.value = lat;
  mapDialogTitle.value = loc.name?.trim() || "Точка на карте";
  mapDialogOpen.value = true;
}

function photoTitle() {
  return (
    photo.value.placeNameText?.trim() ||
    photo.value.enterpriseName?.trim() ||
    photo.value.location?.name?.trim() ||
    "Модерация фото"
  );
}

async function acceptPhoto(_id) {
  if (isPublished.value) return;
  isLoading.value = true;
  const res = await photosStore.moderatePhoto(_id);
  if (res.status !== 400) {
    isPublished.value = true;
    setTimeout(() => {
      isLoading.value = false;
      router.push("/cabinet/moderation-photos/not-moderated-photos");
    }, 400);
  } else {
    isLoading.value = false;
  }
}

async function rejectPhoto(_id) {
  const res = await photosStore.rejectPhoto(_id, moderationMessage.value);
  if (res.status === 200) {
    router.push("/cabinet/moderation-photos/not-moderated-photos");
  }
}

onMounted(async () => {
  pageLoading.value = true;
  try {
    const { data } = await photosStore.getPhotoById(route.query._id);
    photo.value = normalizePhotoItem(data);
    isPublished.value = data.status === "published";
    moderationMessage.value = data.moderationMessage || "";
  } finally {
    pageLoading.value = false;
  }
});

onBeforeUnmount(() => {
  destroyPreviewMap();
});
</script>

<template>
  <div class="photo-moderation-page" style="overflow-x: hidden">
    <BackButton />

    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="14">
        <h2 class="ma-0">{{ photoTitle() }}</h2>
        <p v-if="photo.author?.fullinfo?.fullname" class="photo-moderation-page__author">
          Автор: {{ photo.author.fullinfo.fullname }}
          <template v-if="photo.author?.fullinfo?.phone">
            <br />
            Телефон:
            <a :href="'tel:' + photo.author.fullinfo.phone">{{ photo.author.fullinfo.phone }}</a>
          </template>
        </p>

        <a-spin :spinning="pageLoading" tip="Загрузка…" size="large">
          <template v-if="!pageLoading && photo.url">
            <div
              class="photo-moderation-page__tile"
              :class="{ 'photo-moderation-page__tile--solo': !hasMetaBelowPhoto(photo) }"
            >
              <img :src="photo.url" alt="" class="photo-moderation-page__img" />
              <div v-if="hasMetaBelowPhoto(photo)" class="photo-moderation-page__meta">
                <div
                  v-if="photo.location?.coordinates?.length === 2"
                  class="photo-moderation-page__meta-loc"
                  role="button"
                  tabindex="0"
                  title="Показать на карте"
                  @click="openMapDialog"
                  @keydown.enter.prevent="openMapDialog"
                >
                  <div class="photo-moderation-page__meta-line">
                    {{ photo.location.name?.trim() || "Точка на карте" }}
                  </div>
                  <div class="photo-moderation-page__meta-line photo-moderation-page__meta-line--coords">
                    {{ Number(photo.location.coordinates[0]).toFixed(4) }},
                    {{ Number(photo.location.coordinates[1]).toFixed(4) }}
                  </div>
                </div>
                <div v-if="photo.placeNameText?.trim()" class="photo-moderation-page__meta-line">
                  Место (текст): {{ photo.placeNameText.trim() }}
                </div>
                <div v-if="photo.enterpriseName?.trim()" class="photo-moderation-page__meta-line">
                  Предприятие: {{ photo.enterpriseName.trim() }}
                </div>
                <div v-if="photo.caption?.trim()" class="photo-moderation-page__meta-line">
                  {{ photo.caption.trim() }}
                </div>
              </div>
            </div>
          </template>
        </a-spin>

        <a-textarea
          v-model:value="moderationMessage"
          placeholder="Комментарий при отказе"
          class="mt-16"
          :rows="3"
        />

        <div class="justify-center d-flex">
          <a-button
            :loading="isLoading"
            :disabled="isPublished || !photo._id"
            class="lets_go_btn ma-36"
            type="primary"
            @click="acceptPhoto(photo._id)"
          >
            <span v-if="!isPublished">принять</span>
            <span v-else class="mdi mdi-check-outline"></span>
          </a-button>
          <a-button
            :disabled="isPublished || !photo._id"
            class="btn_light ma-36"
            @click="rejectPhoto(photo._id)"
          >
            отказать
          </a-button>
        </div>
      </a-col>
    </a-row>

    <a-modal
      v-model:open="mapDialogOpen"
      :title="mapDialogTitle"
      width="min(720px, 94vw)"
      wrap-class-name="photo-moderation-map-modal"
      :footer="null"
      destroy-on-close
    >
      <p class="photo-moderation-map-dialog__hint">
        Координаты: {{ mapDialogLon.toFixed(5) }}, {{ mapDialogLat.toFixed(5) }}
      </p>
      <div ref="mapPreviewContainer" class="photo-moderation-map-dialog__map"></div>
    </a-modal>
  </div>
</template>

<style scoped lang="scss">
.photo-moderation-page__author {
  margin: 8px 0 16px;
}

.photo-moderation-page__tile {
  margin-bottom: 20px;
}

.photo-moderation-page__img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px 8px 0 0;
}

.photo-moderation-page__tile--solo .photo-moderation-page__img {
  border-radius: 8px;
}

.photo-moderation-page__meta {
  padding: 10px 10px 12px;
  background: rgba(18, 32, 51, 0.04);
  border-radius: 0 0 8px 8px;
  border: 1px solid rgba(18, 32, 51, 0.08);
  border-top: none;
}

.photo-moderation-page__meta-line {
  font-size: 13px;
  line-height: 1.4;
  color: rgba(18, 32, 51, 0.88);
  word-break: break-word;
}

.photo-moderation-page__meta-line + .photo-moderation-page__meta-line {
  margin-top: 4px;
}

.photo-moderation-page__meta-loc {
  cursor: pointer;
  padding: 4px 6px;
  margin: -4px -6px 4px;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.photo-moderation-page__meta-loc:hover {
  background: rgba(255, 102, 0, 0.1);
}

.photo-moderation-page__meta-loc:focus-visible {
  outline: 2px solid rgba(255, 102, 0, 0.65);
  outline-offset: 1px;
}

.photo-moderation-page__meta-line--coords {
  font-size: 12px;
  color: rgba(18, 32, 51, 0.55);
}
</style>

<style lang="scss">
.photo-moderation-map-modal .photo-moderation-map-dialog__hint {
  margin: 0 0 10px;
  font-size: 13px;
  color: rgba(18, 32, 51, 0.75);
}

.photo-moderation-map-modal .photo-moderation-map-dialog__map {
  width: 100%;
  height: min(52vh, 420px);
  min-height: 280px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 102, 0, 0.45);
}
</style>
