<script setup>
import { ref, watch, computed, nextTick, onBeforeUnmount } from 'vue';
import { message } from 'ant-design-vue';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { usePhotos } from '../../stores/photos.js';
import { useLocations } from '../../stores/locations.js';

const emit = defineEmits(['add']);

defineProps({
  block: { type: Boolean, default: true },
});

const photosStore = usePhotos();
const locationStore = useLocations();

// Выбираем город по _id, а не по shortName: shortName у городов повторяется
// (несколько записей «Глазов», «Пермь»), а кое-где его вообще нет
const ALL_CITIES = '';
const selectedLocationId = ref(ALL_CITIES);

/** Поиск в списке — по названию города, а не по _id, который лежит в value. */
function filterLocationOption(input, option) {
  return String(option?.label ?? '')
    .toLowerCase()
    .includes(String(input ?? '').toLowerCase());
}

const storedRadiusInit = localStorage.getItem('LocationRadius');
const locationRadius = ref(
  storedRadiusInit != null && storedRadiusInit !== '' ? Number(storedRadiusInit) : 100
);
let suppressLocationReload = false;

const modalOpen = ref(false);
const photobankUrls = ref([]);
const photobankPage = ref(1);
const photobankHasMore = ref(false);
const photobankLoading = ref(false);
const photobankLoadingMore = ref(false);
const photobankSearchQuery = ref('');
const photobankSearchActive = ref(false);
const selectedPhotobankUrls = ref([]);

const fullscreenOpen = ref(false);
const fullscreenUrl = ref('');
/** @type {import('vue').Ref<{ url: string; location: object | null; placeNameText: string; enterpriseName: string; caption: string } | null>} */
const fullscreenMeta = ref(null);
const fullscreenWrapRef = ref(null);
const fsMapContainer = ref(null);
/** @type {import('vue').Ref<Record<string, { url: string; location: object | null; placeNameText: string; enterpriseName: string; caption: string }>>} */
const metaByUrl = ref({});
let fsMap = null;
let fsMarker = null;

const fsShowMap = computed(() => {
  const loc = fullscreenMeta.value?.location;
  return !!(
    loc?.coordinates?.length === 2 &&
    Number.isFinite(Number(loc.coordinates[0])) &&
    Number.isFinite(Number(loc.coordinates[1]))
  );
});

const fsHasDetails = computed(() => {
  const m = fullscreenMeta.value;
  if (!m) return false;
  return !!(
    m.location?.coordinates?.length === 2 ||
    m.placeNameText?.trim() ||
    m.enterpriseName?.trim() ||
    m.caption?.trim()
  );
});

const fsAlreadySelected = computed(
  () => !!fullscreenUrl.value && selectedPhotobankUrls.value.includes(fullscreenUrl.value)
);

function destroyFsPreviewMap() {
  if (fsMap) {
    fsMap.remove();
    fsMap = null;
  }
  fsMarker = null;
}

function initFsPreviewMap() {
  const el = fsMapContainer.value;
  const loc = fullscreenMeta.value?.location;
  if (!el || !loc?.coordinates || loc.coordinates.length < 2 || fsMap) return;
  const lon = Number(loc.coordinates[0]);
  const lat = Number(loc.coordinates[1]);
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return;

  fsMap = new maplibregl.Map({
    container: el,
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
        },
      },
      layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
    },
    center: [lon, lat],
    zoom: 13,
  });

  fsMap.on('load', () => {
    fsMarker = new maplibregl.Marker({ color: '#ff6600' })
      .setLngLat([lon, lat])
      .addTo(fsMap);
    fsMap?.resize();
    requestAnimationFrame(() => fsMap?.resize());
    setTimeout(() => fsMap?.resize(), 240);
  });
}

function closeFullscreen() {
  destroyFsPreviewMap();
  fullscreenOpen.value = false;
  fullscreenUrl.value = '';
  fullscreenMeta.value = null;
}

function openFullscreen(url) {
  destroyFsPreviewMap();
  fullscreenUrl.value = url;
  fullscreenMeta.value = metaByUrl.value[url] ?? normalizePhotobankRow({ url });
  fullscreenOpen.value = true;
}

function confirmFullscreen() {
  const url = fullscreenUrl.value;
  if (!url) {
    closeFullscreen();
    return;
  }
  if (selectedPhotobankUrls.value.includes(url)) {
    closeFullscreen();
    return;
  }
  selectedPhotobankUrls.value = [...selectedPhotobankUrls.value, url];
  closeFullscreen();
}

function removeFromSelectionAndClose() {
  const url = fullscreenUrl.value;
  if (!url) return;
  selectedPhotobankUrls.value = selectedPhotobankUrls.value.filter((u) => u !== url);
  closeFullscreen();
}

watch(fullscreenOpen, async (open) => {
  if (!open) {
    destroyFsPreviewMap();
    return;
  }
  await nextTick();
  await nextTick();
  await nextTick();
  const loc = fullscreenMeta.value?.location;
  if (loc?.coordinates?.length === 2) {
    initFsPreviewMap();
    if (!fsMap) {
      await nextTick();
      initFsPreviewMap();
    }
    await nextTick();
    fsMap?.resize();
    setTimeout(() => fsMap?.resize(), 220);
  }
  fullscreenWrapRef.value?.focus();
});

function normalizePhotobankRow(raw) {
  if (typeof raw === 'string') {
    return {
      url: raw,
      location: null,
      placeNameText: '',
      enterpriseName: '',
      caption: '',
    };
  }
  const url = raw?.url != null ? String(raw.url) : '';
  const loc = raw?.location;
  const hasLoc =
    loc &&
    typeof loc === 'object' &&
    loc.type === 'Point' &&
    Array.isArray(loc.coordinates) &&
    loc.coordinates.length === 2;
  return {
    url,
    location: hasLoc
      ? {
          name: loc.name != null ? String(loc.name) : '',
          shortName: loc.shortName != null ? String(loc.shortName) : '',
          type: 'Point',
          coordinates: [Number(loc.coordinates[0]), Number(loc.coordinates[1])],
        }
      : null,
    placeNameText: raw?.placeNameText != null ? String(raw.placeNameText).trim() : '',
    enterpriseName: raw?.enterpriseName != null ? String(raw.enterpriseName).trim() : '',
    caption: raw?.caption != null ? String(raw.caption).trim() : '',
  };
}

function mergeMetaFromItems(items) {
  if (!Array.isArray(items) || !items.length) return;
  const next = { ...metaByUrl.value };
  for (const raw of items) {
    const row = normalizePhotobankRow(raw);
    if (row.url) next[row.url] = row;
  }
  metaByUrl.value = next;
}

function parsePhotosPayload(res) {
  const d = res?.data;
  if (d && Array.isArray(d.urls) && typeof d.hasMore === 'boolean') {
    const urls = d.urls;
    let items = Array.isArray(d.items) ? d.items : [];
    if (!items.length || items.length !== urls.length) {
      items = urls.map((u) => ({ url: typeof u === 'string' ? u : String(u?.url ?? '') }));
    }
    return { urls, items, hasMore: d.hasMore };
  }
  if (Array.isArray(d)) {
    const items = d.map((x) => (typeof x === 'string' ? { url: x } : x));
    const urls = items.map((x) => (typeof x === 'string' ? x : String(x?.url ?? ''))).filter(Boolean);
    return { urls, items, hasMore: d.length > 0 };
  }
  return { urls: [], items: [], hasMore: false };
}

function photosGeoParams() {
  const loc = locationStore.location;
  if (!loc?._id || !loc?.name || !Array.isArray(loc?.coordinates) || loc.coordinates.length < 2) {
    return null;
  }
  return {
    lon: loc.coordinates[0],
    lat: loc.coordinates[1],
    location: loc.name,
    locationRadius: locationRadius.value,
  };
}

const locationFilterActive = computed(() => !!locationStore.location?._id);

const emptyListHint = computed(() => {
  if (photobankSearchActive.value) return 'Ничего не найдено';
  if (locationFilterActive.value) {
    const city = locationStore.location.shortName || locationStore.location.name;
    return `Нет опубликованных фото в радиусе ${locationRadius.value} км от «${city}»`;
  }
  return 'В фотобанке пока нет фотографий';
});

function reloadPhotobankList() {
  closeFullscreen();
  selectedPhotobankUrls.value = [];
  if (photobankSearchQuery.value.trim()) {
    loadSearchPage(1);
  } else {
    loadBrowsePage(1);
  }
}

function syncLocationSelectFromStore() {
  const loc = locationStore.location;
  selectedLocationId.value = loc?._id ? String(loc._id) : ALL_CITIES;
}

async function onPhotobankLocationChange(value) {
  suppressLocationReload = true;
  if (!value) {
    await locationStore.resetLocation();
  } else {
    const loc = locationStore.locations.find((l) => String(l._id) === String(value));
    if (loc) {
      await locationStore.setLocation(loc);
    }
  }
  syncLocationSelectFromStore();
  suppressLocationReload = false;
  reloadPhotobankList();
}

async function loadBrowsePage(pageNum) {
  photobankLoading.value = true;
  try {
    const res = await photosStore.getPhotos(pageNum, photosGeoParams());
    const { urls, items, hasMore } = parsePhotosPayload(res);
    photobankUrls.value = urls;
    metaByUrl.value = {};
    mergeMetaFromItems(items);
    photobankPage.value = pageNum;
    photobankHasMore.value = hasMore;
    photobankSearchActive.value = false;
  } catch {
    message.error('Не удалось загрузить фотобанк');
  } finally {
    photobankLoading.value = false;
  }
}

async function loadSearchPage(pageNum) {
  const q = photobankSearchQuery.value.trim();
  if (!q) {
    await loadBrowsePage(1);
    return;
  }
  photobankLoading.value = true;
  try {
    const res = await photosStore.searchPhotos(q, pageNum, photosGeoParams());
    const { urls, items, hasMore } = parsePhotosPayload(res);
    photobankUrls.value = urls;
    metaByUrl.value = {};
    mergeMetaFromItems(items);
    photobankPage.value = pageNum;
    photobankHasMore.value = hasMore;
    photobankSearchActive.value = true;
  } catch {
    message.error('Не удалось выполнить поиск');
  } finally {
    photobankLoading.value = false;
  }
}

function resetModalState() {
  closeFullscreen();
  photobankSearchQuery.value = '';
  photobankSearchActive.value = false;
  selectedPhotobankUrls.value = [];
  photobankPage.value = 1;
  photobankUrls.value = [];
  metaByUrl.value = {};
  photobankHasMore.value = false;
}

function openModal() {
  modalOpen.value = true;
}

watch(modalOpen, async (open) => {
  if (open) {
    resetModalState();
    if (!locationStore.locations?.length) {
      await locationStore.fetchLocations();
    }
    suppressLocationReload = true;
    try {
      await locationStore.refreshLocation();
    } catch {
      /* ignore invalid location in localStorage */
    }
    syncLocationSelectFromStore();
    suppressLocationReload = false;
    loadBrowsePage(1);
  } else {
    closeFullscreen();
  }
});

watch(locationRadius, (newRadius) => {
  localStorage.setItem('LocationRadius', String(newRadius));
  if (modalOpen.value) {
    reloadPhotobankList();
  }
});

watch(
  () => locationStore.location?._id ?? '',
  () => {
    if (!modalOpen.value || suppressLocationReload) return;
    syncLocationSelectFromStore();
    reloadPhotobankList();
  }
);

function runSearch() {
  closeFullscreen();
  selectedPhotobankUrls.value = [];
  if (!photobankSearchQuery.value.trim()) {
    loadBrowsePage(1);
    return;
  }
  loadSearchPage(1);
}

function clearSearch() {
  closeFullscreen();
  photobankSearchQuery.value = '';
  selectedPhotobankUrls.value = [];
  loadBrowsePage(1);
}

async function loadMore() {
  if (photobankLoadingMore.value || !photobankHasMore.value) return;
  photobankLoadingMore.value = true;
  try {
    const nextPage = photobankPage.value + 1;
    const geo = photosGeoParams();
    const res = photobankSearchActive.value
      ? await photosStore.searchPhotos(photobankSearchQuery.value.trim(), nextPage, geo)
      : await photosStore.getPhotos(nextPage, geo);
    const { urls: chunk, items, hasMore } = parsePhotosPayload(res);
    if (chunk.length) {
      photobankUrls.value = [...photobankUrls.value, ...chunk];
      mergeMetaFromItems(items);
      photobankPage.value = nextPage;
    }
    photobankHasMore.value = chunk.length ? hasMore : false;
  } catch {
    message.error('Не удалось подгрузить фото');
  } finally {
    photobankLoadingMore.value = false;
  }
}

function isUrlSelected(url) {
  return selectedPhotobankUrls.value.includes(url);
}

function confirmSelection() {
  const urls = [...selectedPhotobankUrls.value];
  if (!urls.length) {
    message.warning('Выберите хотя бы одно фото');
    return;
  }
  emit('add', urls);
  modalOpen.value = false;
  message.success(urls.length === 1 ? 'Фото добавлено' : `Добавлено фото: ${urls.length}`);
}

onBeforeUnmount(() => {
  destroyFsPreviewMap();
});
</script>

<template>
  <div class="add-photo-from-photobank">
    <a-button type="dashed" :block="block" class="add-photo-from-photobank__trigger ma-8" @click="openModal">
      <slot>
        <span class="mdi mdi-image-multiple-outline mdi-18px" style="margin-right: 6px" aria-hidden="true"></span>
        Из фотобанка
      </slot>
    </a-button>

    <a-modal
      v-model:open="modalOpen"
      title="Выберите фото из фотобанка"
      width="min(980px, 96vw)"
      :footer="null"
      :destroy-on-close="true"
    >
      <div class="add-photo-from-photobank__location">
        <div class="add-photo-from-photobank__location-title">Место съёмки</div>
        <a-select
          v-model:value="selectedLocationId"
          class="add-photo-from-photobank__location-select"
          show-search
          placeholder="Выберите город"
          :filter-option="filterLocationOption"
          :loading="!locationStore.locations?.length"
          @change="onPhotobankLocationChange"
        >
          <a-select-option :value="ALL_CITIES" label="Ваш город — все фото">Ваш город — все фото</a-select-option>
          <a-select-option
            v-for="(location, index) in locationStore.locations"
            :key="location._id ?? index"
            :value="String(location._id ?? index)"
            :label="location.name"
          >
            {{ location.name }}
          </a-select-option>
        </a-select>
        <template v-if="locationStore.location?._id">
          <a-slider
            v-model:value="locationRadius"
            class="add-photo-from-photobank__radius-slider"
            :step="100"
            :min="0"
            :max="1800"
            tooltip-placement="right"
            :tip-formatter="(s) => s + ' км'"
          />
          <b class="add-photo-from-photobank__radius-label">Радиус поиска {{ locationRadius }} км.</b>
        </template>
        <p v-else class="add-photo-from-photobank__location-hint">Показаны фото из любого города</p>
      </div>

      <div class="add-photo-from-photobank__toolbar">
        <a-input-search
          v-model:value="photobankSearchQuery"
          placeholder="Поиск по URL, ключу или подписи"
          allow-clear
          enter-button="Найти"
          size="large"
          @search="runSearch"
        />
        <a-button
          v-if="photobankSearchActive || photobankSearchQuery.trim()"
          type="link"
          class="add-photo-from-photobank__all"
          @click="clearSearch"
        >
          Все фото
        </a-button>
      </div>
      <a-spin :spinning="photobankLoading">
        <div v-if="!photobankLoading && !photobankUrls.length" class="add-photo-from-photobank__empty">
          {{ emptyListHint }}
        </div>
        <template v-else-if="!photobankLoading && photobankUrls.length">
          <div class="add-photo-from-photobank__grid">
            <div
              v-for="(url, idx) in photobankUrls"
              :key="`${url}-${idx}`"
              class="add-photo-from-photobank__cell"
              :class="{ 'add-photo-from-photobank__cell--selected': isUrlSelected(url) }"
              role="button"
              tabindex="0"
              @click="openFullscreen(url)"
              @keydown.enter.prevent="openFullscreen(url)"
            >
              <img :src="url" alt="" loading="lazy" />
              <span class="add-photo-from-photobank__check mdi mdi-check-bold" aria-hidden="true"></span>
            </div>
          </div>
          <div v-if="photobankHasMore" class="add-photo-from-photobank__more">
            <a-button shape="round" :loading="photobankLoadingMore" @click="loadMore">ещё</a-button>
          </div>
        </template>
      </a-spin>
      <div class="add-photo-from-photobank__footer">
        <span class="add-photo-from-photobank__count">Выбрано: {{ selectedPhotobankUrls.length }}</span>
        <div class="add-photo-from-photobank__footer-btns">
          <a-button @click="modalOpen = false">Отмена</a-button>
          <a-button type="primary" :disabled="!selectedPhotobankUrls.length" @click="confirmSelection">
            Добавить выбранные
          </a-button>
        </div>
      </div>
    </a-modal>

    <Teleport to="body">
      <Transition name="apb-photobank-fs">
        <div
          v-if="fullscreenOpen"
          ref="fullscreenWrapRef"
          class="add-photo-from-photobank-fs"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фото из фотобанка"
          tabindex="-1"
          @click.self="closeFullscreen"
          @keydown.escape.prevent="closeFullscreen"
        >
          <div class="add-photo-from-photobank-fs__panel" @click.stop>
            <img class="add-photo-from-photobank-fs__img" :src="fullscreenUrl" alt="" />
            <div v-if="fsHasDetails && fullscreenMeta" class="add-photo-from-photobank-fs__details">
              <template v-if="fullscreenMeta.location?.coordinates?.length === 2">
                <div class="add-photo-from-photobank-fs__detail-line">
                  {{ fullscreenMeta.location.name?.trim() || 'Точка на карте' }}
                </div>
                <div class="add-photo-from-photobank-fs__detail-line add-photo-from-photobank-fs__detail-line--muted">
                  {{ Number(fullscreenMeta.location.coordinates[0]).toFixed(5) }},
                  {{ Number(fullscreenMeta.location.coordinates[1]).toFixed(5) }}
                </div>
              </template>
              <div v-if="fullscreenMeta.placeNameText?.trim()" class="add-photo-from-photobank-fs__detail-line">
                Место (текст): {{ fullscreenMeta.placeNameText.trim() }}
              </div>
              <div v-if="fullscreenMeta.enterpriseName?.trim()" class="add-photo-from-photobank-fs__detail-line">
                Предприятие: {{ fullscreenMeta.enterpriseName.trim() }}
              </div>
              <div v-if="fullscreenMeta.caption?.trim()" class="add-photo-from-photobank-fs__detail-line">
                {{ fullscreenMeta.caption.trim() }}
              </div>
            </div>
            <div
              v-if="fsShowMap"
              ref="fsMapContainer"
              class="add-photo-from-photobank-fs__map"
              role="presentation"
            />
            <p v-if="fsAlreadySelected" class="add-photo-from-photobank-fs__hint">Уже в выбранных</p>
            <div class="add-photo-from-photobank-fs__actions">
              <a-button shape="round" size="large" @click="closeFullscreen">Отмена</a-button>
              <a-button
                v-if="fsAlreadySelected"
                shape="round"
                size="large"
                danger
                @click="removeFromSelectionAndClose"
              >
                Снять выбор
              </a-button>
              <a-button v-else type="primary" shape="round" size="large" @click="confirmFullscreen">
                Выбрать
              </a-button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.add-photo-from-photobank__trigger {
  width: 100%;
}

.add-photo-from-photobank__location {
  margin-bottom: 16px;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(35, 159, 202, 0.08);
  border: 1px solid rgba(35, 159, 202, 0.2);
}

.add-photo-from-photobank__location-title {
  font-size: 13px;
  line-height: 1.3;
  font-weight: 600;
  margin-bottom: 10px;
  color: rgba(18, 32, 51, 0.85);
}

.add-photo-from-photobank__location-select {
  width: 100%;
}

.add-photo-from-photobank__radius-slider {
  margin-top: 12px;
}

.add-photo-from-photobank__location-hint {
  margin: 6px 0 0;
  font-size: 13px;
  color: rgba(18, 32, 51, 0.55);
}

.add-photo-from-photobank__radius-label {
  display: block;
  margin-top: 4px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(18, 32, 51, 0.8);
}

.add-photo-from-photobank__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-bottom: 16px;
}

.add-photo-from-photobank__toolbar :deep(.ant-input-search) {
  flex: 1 1 220px;
  min-width: 0;
}

.add-photo-from-photobank__all {
  flex-shrink: 0;
  padding-inline: 4px;
}

.add-photo-from-photobank__empty {
  text-align: center;
  padding: 40px 16px;
  color: rgba(0, 0, 0, 0.45);
}

.add-photo-from-photobank__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
  gap: 14px;
  max-height: 52vh;
  overflow-y: auto;
  padding: 4px 2px 12px;
}

.add-photo-from-photobank__cell {
  position: relative;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  background: #fafafa;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.add-photo-from-photobank__cell:hover {
  border-color: #ff6600;
}

.add-photo-from-photobank__cell:focus-visible {
  outline: 2px solid #ff6600;
  outline-offset: 2px;
}

.add-photo-from-photobank__cell--selected {
  border-color: #ff6600;
  box-shadow: 0 0 0 1px rgba(255, 102, 0, 0.35);
}

.add-photo-from-photobank__cell img {
  width: 100%;
  height: 168px;
  object-fit: cover;
  display: block;
  animation: add-photo-pb-thumb-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes add-photo-pb-thumb-in {
  from {
    opacity: 0;
    transform: scale(1.05);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.add-photo-from-photobank__check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #ccc;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.add-photo-from-photobank__cell--selected .add-photo-from-photobank__check {
  background: #ff6600;
  color: #fff;
}

.add-photo-from-photobank__more {
  display: flex;
  justify-content: center;
  padding-top: 12px;
}

.add-photo-from-photobank__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.add-photo-from-photobank__count {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.add-photo-from-photobank__footer-btns {
  display: flex;
  gap: 8px;
}

.add-photo-from-photobank-fs {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.add-photo-from-photobank-fs__panel {
  max-width: min(100vw - 40px, 1200px);
  width: 100%;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  padding-bottom: 8px;
}

.add-photo-from-photobank-fs__img {
  max-width: 100%;
  max-height: min(44vh, 440px);
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
  align-self: center;
}

.add-photo-from-photobank-fs__details {
  width: 100%;
  max-width: 640px;
  align-self: center;
  text-align: left;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.add-photo-from-photobank-fs__detail-line {
  font-size: 14px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.94);
  word-break: break-word;
}

.add-photo-from-photobank-fs__detail-line + .add-photo-from-photobank-fs__detail-line {
  margin-top: 6px;
}

.add-photo-from-photobank-fs__detail-line--muted {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.62);
}

.add-photo-from-photobank-fs__map {
  width: 100%;
  max-width: 720px;
  align-self: center;
  height: 280px;
  min-height: 200px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid rgba(255, 102, 0, 0.55);
}

.add-photo-from-photobank-fs__hint {
  margin: 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  align-self: center;
}

.add-photo-from-photobank-fs__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 16px;
  align-self: center;
}

.apb-photobank-fs-enter-active,
.apb-photobank-fs-leave-active {
  transition: opacity 0.28s ease;
}

.apb-photobank-fs-enter-from,
.apb-photobank-fs-leave-to {
  opacity: 0;
}

.apb-photobank-fs-enter-active .add-photo-from-photobank-fs__panel,
.apb-photobank-fs-leave-active .add-photo-from-photobank-fs__panel {
  transition:
    transform 0.38s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.32s ease;
}

.apb-photobank-fs-enter-from .add-photo-from-photobank-fs__panel,
.apb-photobank-fs-leave-to .add-photo-from-photobank-fs__panel {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
</style>
