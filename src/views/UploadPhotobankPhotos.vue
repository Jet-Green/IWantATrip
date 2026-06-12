<script setup>
import { ref, reactive, watch, computed, nextTick, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { usePhotos } from "../stores/photos.js";
import { useAppState } from "../stores/appState";
import { message } from "ant-design-vue";

const router = useRouter();
const photosStore = usePhotos();
const appStateStore = useAppState();

const fileInputRef = ref(null);
/** @type {import('vue').Ref<Array<{ id: number; file: File; preview: string; location: { name: string; shortName: string; type: string; coordinates: number[] } | null; placeNameText: string; enterpriseName: string }>>} */
const items = ref([]);
let nextItemId = 1;

const uploading = ref(false);
const targetIdForDelete = ref(null);
const delPhotoDialog = ref(false);
const licenseAccepted = ref(false);

/** Модальное окно метаданных (как «Адрес или координаты» в создании места) */
const metaModalOpen = ref(false);
const metaTargetId = ref(null);
/** Подавляет сброс координат при программной установке режима при открытии */
let suppressMetaLocationTypeReset = false;

const metaLocationType = ref("dadataLocation");
const metaLocation = reactive({
  name: "",
  shortName: "",
  type: "Point",
  coordinates: /** @type {number[]} */ ([]),
});
const metaLocationSearchRequest = ref("");
const metaPossibleLocations = ref([]);
const metaCustomMapAddressRequest = ref("");
const metaCustomMapAddressOptions = ref([]);
const metaPlaceNameText = ref("");
const metaEnterpriseName = ref("");

const metaMapContainer = ref(null);
/** @type {maplibregl.Map | null} */
let metaMap = null;
/** @type {maplibregl.Marker | null} */
let metaMapMarker = null;

/** Публичный PDF из `public/documents/` — тот же путь, что в списке «Документы». */
const PHOTOBANK_LICENSE_DOC_PATH =
  "/documents/Лицензионное соглашение на публикацию изображений в фотобанке.pdf";

function openPhotobankLicense() {
  appStateStore.docLink = PHOTOBANK_LICENSE_DOC_PATH;
  router.push({ name: "Document" });
}

function openFilePicker() {
  fileInputRef.value?.click();
}

const fetchAddressSuggestions = async (query) => {
  const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token " + import.meta.env.VITE_DADATA_TOKEN,
    },
    body: JSON.stringify({
      query,
      count: 5,
      from_bound: { value: "city" },
      to_bound: { value: "house" },
    }),
  };

  const res = await fetch(url, options);
  const data = JSON.parse(await res.text());
  const suggestions = data?.suggestions ?? [];
  return suggestions
    .filter((s) => s?.data?.geo_lon && s?.data?.geo_lat)
    .map((s) => {
      let shortName = s.value;
      if (s.data.settlement) shortName = s.data.settlement;
      else if (s.data.city) shortName = s.data.city;

      return {
        value: s.value,
        location: {
          name: s.value,
          shortName,
          type: "Point",
          coordinates: [Number(s.data.geo_lon), Number(s.data.geo_lat)],
        },
      };
    });
};

const isMetaLocationValid = computed(() => metaLocation.coordinates?.length === 2);

function getMetaInitialMapCenter() {
  if (isMetaLocationValid.value) {
    return [Number(metaLocation.coordinates[0]), Number(metaLocation.coordinates[1])];
  }
  return [37.6176, 55.7558];
}

function destroyMetaMap() {
  if (metaMap) {
    metaMap.remove();
    metaMap = null;
  }
  metaMapMarker = null;
}

function setMetaMapPoint(lon, lat, shouldFly = false) {
  const longitude = Number(Number(lon).toFixed(6));
  const latitude = Number(Number(lat).toFixed(6));
  metaLocation.type = "Point";
  metaLocation.coordinates = [longitude, latitude];

  if (!metaMap) return;

  if (!metaMapMarker) {
    metaMapMarker = new maplibregl.Marker({ color: "#ff6600" })
      .setLngLat([longitude, latitude])
      .addTo(metaMap);
  } else {
    metaMapMarker.setLngLat([longitude, latitude]);
  }

  if (shouldFly) {
    metaMap.flyTo({
      center: [longitude, latitude],
      zoom: 13,
      duration: 500,
    });
  }
}

function initMetaMap() {
  if (!metaMapContainer.value || metaMap) return;

  metaMap = new maplibregl.Map({
    container: metaMapContainer.value,
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
    center: getMetaInitialMapCenter(),
    zoom: isMetaLocationValid.value ? 13 : 10,
  });

  metaMap.on("load", () => {
    if (isMetaLocationValid.value) {
      setMetaMapPoint(metaLocation.coordinates[0], metaLocation.coordinates[1]);
    }
  });

  metaMap.on("click", (e) => {
    setMetaMapPoint(e.lngLat.lng, e.lngLat.lat);
  });
}

function selectMetaStartLocation(selected) {
  for (const l of metaPossibleLocations.value) {
    if (l.value === selected) {
      Object.assign(metaLocation, l.location);
      metaLocationSearchRequest.value = metaLocation.name;
    }
  }
}

function selectMetaMapAddress(selected) {
  for (const l of metaCustomMapAddressOptions.value) {
    if (l.value === selected) {
      metaLocation.name = l.location.name;
      metaLocation.shortName = l.location.shortName;
      setMetaMapPoint(l.location.coordinates[0], l.location.coordinates[1], true);
    }
  }
}

watch(metaLocationSearchRequest, async (newValue) => {
  if (metaLocationType.value !== "dadataLocation") return;
  if (newValue.trim().length <= 2) {
    metaPossibleLocations.value = [];
    return;
  }
  try {
    metaPossibleLocations.value = await fetchAddressSuggestions(newValue);
  } catch (e) {
    console.error(e);
    metaPossibleLocations.value = [];
  }
});

watch(metaCustomMapAddressRequest, async (newValue) => {
  if (metaLocationType.value !== "customLocation") return;
  if (newValue.trim().length <= 2) {
    metaCustomMapAddressOptions.value = [];
    return;
  }
  try {
    metaCustomMapAddressOptions.value = await fetchAddressSuggestions(newValue);
  } catch (e) {
    console.error(e);
    metaCustomMapAddressOptions.value = [];
  }
});

watch(metaLocationType, () => {
  destroyMetaMap();
  if (suppressMetaLocationTypeReset) return;
  Object.assign(metaLocation, { name: "", shortName: "", type: "Point", coordinates: [] });
  metaLocationSearchRequest.value = "";
  metaPossibleLocations.value = [];
  metaCustomMapAddressRequest.value = "";
  metaCustomMapAddressOptions.value = [];
});

watch(metaLocationType, async (newType) => {
  if (newType !== "customLocation") return;
  await nextTick();
  initMetaMap();
  if (metaMap) {
    metaMap.resize();
    if (isMetaLocationValid.value) {
      setMetaMapPoint(metaLocation.coordinates[0], metaLocation.coordinates[1], true);
    }
  }
});

watch(metaModalOpen, (open) => {
  if (!open) {
    destroyMetaMap();
    metaTargetId.value = null;
    return;
  }
  nextTick(() => {
    metaMap?.resize();
  });
});

async function openMetaModal(item) {
  suppressMetaLocationTypeReset = true;
  metaTargetId.value = item.id;
  metaModalOpen.value = true;
  await nextTick();

  metaPlaceNameText.value = item.placeNameText || "";
  metaEnterpriseName.value = item.enterpriseName || "";

  const loc = item.location;
  if (loc?.coordinates?.length === 2) {
    Object.assign(metaLocation, {
      name: loc.name || "",
      shortName: loc.shortName || "",
      type: "Point",
      coordinates: [Number(loc.coordinates[0]), Number(loc.coordinates[1])],
    });
    const hasName = String(loc.name || "").trim().length > 0;
    metaLocationType.value = hasName ? "dadataLocation" : "customLocation";
    metaLocationSearchRequest.value = hasName ? loc.name : "";
    metaPossibleLocations.value = [];
    metaCustomMapAddressRequest.value = "";
    metaCustomMapAddressOptions.value = [];
  } else {
    Object.assign(metaLocation, { name: "", shortName: "", type: "Point", coordinates: [] });
    metaLocationType.value = "dadataLocation";
    metaLocationSearchRequest.value = "";
    metaPossibleLocations.value = [];
    metaCustomMapAddressRequest.value = "";
    metaCustomMapAddressOptions.value = [];
  }

  await nextTick();
  if (metaLocationType.value === "customLocation") {
    if (!metaMap) initMetaMap();
    if (metaMap && isMetaLocationValid.value) {
      setMetaMapPoint(metaLocation.coordinates[0], metaLocation.coordinates[1], true);
    }
    metaMap?.resize();
  }

  nextTick(() => {
    suppressMetaLocationTypeReset = false;
  });
}

function applyMetaModal() {
  const id = metaTargetId.value;
  const row = items.value.find((x) => x.id === id);
  if (!row) {
    metaModalOpen.value = false;
    return;
  }
  row.placeNameText = metaPlaceNameText.value || "";
  row.enterpriseName = metaEnterpriseName.value || "";
  if (isMetaLocationValid.value) {
    row.location = {
      name: metaLocation.name || "",
      shortName: metaLocation.shortName || "",
      type: "Point",
      coordinates: [...metaLocation.coordinates],
    };
  } else {
    row.location = null;
  }
  metaModalOpen.value = false;
}

function onFilesSelected(event) {
  const list = event.target?.files ? Array.from(event.target.files) : [];
  event.target.value = "";

  for (const file of list) {
    if (!file.type.startsWith("image/")) {
      message.warning(`Пропущен файл (нужно изображение): ${file.name}`);
      continue;
    }
    items.value.push({
      id: nextItemId++,
      file,
      preview: URL.createObjectURL(file),
      location: null,
      placeNameText: "",
      enterpriseName: "",
    });
  }
}

function askRemove(id) {
  targetIdForDelete.value = id;
  delPhotoDialog.value = true;
}

function removePhoto() {
  const id = targetIdForDelete.value;
  if (id == null) return;
  const i = items.value.findIndex((x) => x.id === id);
  if (i === -1) return;
  URL.revokeObjectURL(items.value[i].preview);
  items.value.splice(i, 1);
  targetIdForDelete.value = null;
  delPhotoDialog.value = false;
}

function hasAnyMeta(item) {
  return !!(
    (item.location?.coordinates?.length === 2) ||
    item.placeNameText?.trim() ||
    item.enterpriseName?.trim()
  );
}

async function submit() {
  if (!items.value.length) {
    message.warning("Добавьте хотя бы одно фото");
    return;
  }
  if (!licenseAccepted.value) {
    message.warning("Подтвердите права и согласие с условиями лицензии");
    return;
  }
  uploading.value = true;
  try {
    const fd = new FormData();
    const ts = Date.now();
    const metadata = [];
    for (let i = 0; i < items.value.length; i++) {
      const row = items.value[i];
      const f = row.file;
      const ext = f.name && f.name.includes(".") ? f.name.slice(f.name.lastIndexOf(".")) : "";
      const name = `photobank_${ts}_${i}${ext || ".jpg"}`;
      fd.append("photobank-photo", f, name);

      const m = {};
      if (row.enterpriseName?.trim()) m.enterpriseName = row.enterpriseName.trim();
      if (row.placeNameText?.trim()) m.placeNameText = row.placeNameText.trim();
      if (row.location?.coordinates?.length === 2) {
        m.location = {
          name: row.location.name,
          shortName: row.location.shortName,
          type: "Point",
          coordinates: row.location.coordinates,
        };
      }
      metadata.push(m);
    }
    fd.append("photobankMetadata", JSON.stringify(metadata));

    const res = await photosStore.uploadPhotobankPhotos(fd);
    if (res.status === 200 || res.status === 201) {
      message.success({
        content: "Фото отправлены на модерацию",
        onClose: () => router.push("/cabinet/my-photobank/on-moderation"),
      });
    }
  } catch (err) {
    console.error(err);
    message.error("Не удалось загрузить фото. Проверьте формат или попробуйте позже.");
  } finally {
    uploading.value = false;
  }
}

onBeforeUnmount(() => {
  destroyMetaMap();
});
</script>

<template>
  <div class="upload-photobank">
    <input ref="fileInputRef" type="file" class="sr-only" accept="image/jpeg,image/png,image/gif,image/webp" multiple
      @change="onFilesSelected" />
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <h2>Загрузка фото в фотобанк</h2>
        <p class="muted">
          Выберите изображения (JPEG, PNG, GIF, WebP). Для каждого нажмите «Указать место»: можно задать адрес,
          либо геоточку на карте, как при создании места, плюс название места или предприятия — всё по желанию.
          После отправки снимки уходят на модерацию и появятся в разделе
          <a href="/photos">«Фотобанк»</a> после одобления администратором.
        </p>
      </a-col>
      <a-col :span="24">
        <a-button type="dashed" block shape="round" class="add-btn" @click="openFilePicker">
          <span class="mdi mdi-camera-plus mdi-24px mr-8" aria-hidden="true"></span>
          Выбрать фото
        </a-button>
      </a-col>
      <a-col v-if="items.length" :span="24">
        <a-row :gutter="[16, 16]">
          <a-col v-for="item in items" :key="item.id" :xs="24" :sm="12" :md="8" :lg="6">
            <div class="preview-card">
              <div class="preview-wrap">
                <img :src="item.preview" alt="" class="preview-img" loading="lazy" />
                <div class="preview-wrap__remove-bar">
                  <a-button danger size="small" shape="round" class="remove-btn" @click="askRemove(item.id)">
                    удалить
                  </a-button>
                </div>
              </div>
              <div class="photo-card-body">
                <div class="photo-meta-summary">
                  <template v-if="item.location?.coordinates?.length === 2">
                    <div class="photo-meta-line">
                      {{ item.location.name?.trim() || "Точка на карте" }}
                    </div>
                    <div class="photo-meta-coords">
                      lon {{ Number(item.location.coordinates[0]).toFixed(5) }}, lat
                      {{ Number(item.location.coordinates[1]).toFixed(5) }}
                    </div>
                  </template>
                  <div v-else class="photo-meta-empty">Место не указано</div>
                  <div v-if="item.placeNameText?.trim()" class="photo-meta-extra">
                    Место (текст): {{ item.placeNameText.trim() }}
                  </div>
                  <div v-if="item.enterpriseName?.trim()" class="photo-meta-extra">
                    Предприятие: {{ item.enterpriseName.trim() }}
                  </div>
                </div>
                <a-button block shape="round" type="default" class="photobank-meta-open-btn"
                  :class="{ 'photobank-meta-open-btn--filled': hasAnyMeta(item) }" @click="openMetaModal(item)">
                  <span class="mdi mdi-map-marker-outline" aria-hidden="true"></span>
                  Указать место
                </a-button>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-checkbox v-model:checked="licenseAccepted" class="license-checkbox">
          <span class="license-checkbox__text">
            Я подтверждаю, что обладаю правами и принимаю
            <a href="#" class="license-inline-link" @click.prevent.stop="openPhotobankLicense">
              условия лицензии
            </a>
          </span>
        </a-checkbox>
      </a-col>
      <a-col :span="24" class="upload-photobank__footer-wrap">
        <a-button class="photobank-action-btn btn_light" shape="round" @click="router.push('/cabinet/me')">
          В кабинет
        </a-button>
        <a-button type="primary" class="photobank-action-btn lets_go_btn" shape="round" :loading="uploading"
          :disabled="!items.length || !licenseAccepted" @click="submit">
          Отправить в фотобанк
        </a-button>
      </a-col>
    </a-row>

    <a-modal v-model:open="metaModalOpen" title="Указать место" width="min(720px, 96vw)"
      wrap-class-name="upload-photobank-modal" :destroy-on-close="false" @cancel="destroyMetaMap">
      <div class="meta-modal">
        <div class="meta-modal__section-title">Место</div>
        <div class="meta-modal__radio">
          <a-radio-group v-model:value="metaLocationType" name="photobankMetaLocationType">
            <a-radio value="dadataLocation">Адрес</a-radio>
            <a-radio value="customLocation">Координаты</a-radio>
          </a-radio-group>
        </div>

        <div v-if="metaLocationType === 'dadataLocation'" class="meta-modal__block">
          <a-auto-complete v-model:value="metaLocationSearchRequest" style="width: 100%"
            :options="metaPossibleLocations" placeholder="Начните ввод адреса" allow-clear
            @select="selectMetaStartLocation" />
        </div>
        <div v-else class="meta-modal__block">
          <a-auto-complete v-model:value="metaCustomMapAddressRequest" style="width: 100%; margin-bottom: 8px"
            :options="metaCustomMapAddressOptions" placeholder="Найти адрес на карте" allow-clear
            @select="selectMetaMapAddress" />
          <p class="meta-modal__map-hint">Кликните по карте, чтобы выбрать геоточку.</p>
          <div ref="metaMapContainer" class="meta-modal__map"></div>
          <div class="meta-modal__coords">
            <div>
              Широта (lon): <b>{{ metaLocation.coordinates?.[0] ?? "не выбрано" }}</b>
            </div>
            <div>
              Долгота (lat): <b>{{ metaLocation.coordinates?.[1] ?? "не выбрано" }}</b>
            </div>
          </div>
        </div>

        <div class="meta-modal__section-title">Дополнительно</div>
        <div class="meta-modal__block">
          <div class="meta-modal__label">Название места (текстом)</div>
          <a-input v-model:value="metaPlaceNameText" placeholder="Необязательно" allow-clear />
          <div class="meta-modal__label">Название предприятия</div>
          <a-input v-model:value="metaEnterpriseName" placeholder="Необязательно" allow-clear />
        </div>
      </div>
      <template #footer>
        <div class="upload-photobank-modal__footer">
          <a-button shape="round" @click="metaModalOpen = false">Отмена</a-button>
          <a-button type="primary" shape="round" @click="applyMetaModal">Сохранить</a-button>
        </div>
      </template>
    </a-modal>

    <a-modal v-model:open="delPhotoDialog" wrap-class-name="upload-photobank-modal" title="Удалить фото?" ok-text="Да"
      cancel-text="Нет" :ok-button-props="{ shape: 'round' }" :cancel-button-props="{ shape: 'round' }"
      @ok="removePhoto">
      <p>Убрать это фото из списка загрузки?</p>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped>
.upload-photobank {
  padding: 8px 0 48px;
  max-width: 1100px;
  margin: 0 auto;

  h2 {
    margin: 0 0 8px 0;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.muted {
  margin: 0 0 8px;
  color: rgba(18, 32, 51, 0.72);
  font-size: 14px;
}

.add-btn {
  min-height: 44px;
}

.upload-photobank :deep(.add-btn.ant-btn),
.upload-photobank :deep(.remove-btn.ant-btn),
.upload-photobank :deep(.photobank-meta-open-btn.ant-btn) {
  border-radius: 999px !important;
}

.upload-photobank__footer-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px 16px;
}

.upload-photobank__footer-wrap :deep(.photobank-action-btn.ant-btn) {
  border-radius: 100px !important;
  padding-left: clamp(18px, 4vw, 28px);
  padding-right: clamp(18px, 4vw, 28px);
  min-height: 44px;
}

.license-checkbox {
  width: 100%;
}

.license-checkbox :deep(.ant-checkbox + span) {
  white-space: normal;
  line-height: 1.35;
}

.license-checkbox__text {
  color: rgba(18, 32, 51, 0.92);
  font-size: 14px;
}

.license-inline-link {
  font-weight: 700;
  color: #ff6600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.license-inline-link:hover {
  color: #e65c00;
}

.mr-8 {
  margin-right: 8px;
}

.preview-card {
  border: 1px solid rgba(255, 102, 0, 0.25);
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}

.preview-wrap {
  position: relative;
  border-bottom: 1px solid rgba(18, 32, 51, 0.08);
}

.preview-img {
  display: block;
  width: 100%;
  height: auto;
}

.preview-wrap__remove-bar {
  padding: 8px;
}

.preview-wrap :deep(.remove-btn.ant-btn) {
  width: 100%;
}

.photo-card-body {
  padding: 10px 10px 12px;
}

.photo-meta-summary {
  min-height: 52px;
  margin-bottom: 8px;
  font-size: 12px;
  line-height: 1.35;
}

.photo-meta-line {
  font-weight: 600;
  color: rgba(18, 32, 51, 0.88);
}

.photo-meta-coords {
  color: rgba(18, 32, 51, 0.55);
  font-size: 11px;
  margin-top: 2px;
}

.photo-meta-empty {
  color: rgba(18, 32, 51, 0.45);
}

.photo-meta-extra {
  margin-top: 4px;
  color: rgba(18, 32, 51, 0.72);
}

.photobank-meta-open-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.photobank-meta-open-btn--filled {
  border-color: rgba(255, 102, 0, 0.55) !important;
  color: #cc5200 !important;
}

.meta-modal__section-title {
  font-weight: 700;
  font-size: 14px;
  margin: 0 0 8px;
  color: rgba(18, 32, 51, 0.9);
}

.meta-modal__radio {
  margin-bottom: 12px;
}

.meta-modal__block {
  margin-bottom: 16px;
}

.meta-modal__map-hint {
  margin-bottom: 8px;
  color: rgba(18, 32, 51, 0.75);
  font-size: 13px;
}

.meta-modal__map {
  width: 100%;
  height: 320px;
  border: 1px solid #ff6600;
  border-radius: 10px;
  overflow: hidden;
}

.meta-modal__coords {
  margin-top: 8px;
  display: grid;
  gap: 4px;
  font-size: 13px;
}

.meta-modal__label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(18, 32, 51, 0.65);
  margin: 10px 0 4px;
}

.meta-modal__block .meta-modal__label:first-of-type {
  margin-top: 0;
}
</style>

<style lang="scss">
/* Модалки монтируются в body — без scoped, чтобы скруглить футеры */
.upload-photobank-modal .upload-photobank-modal__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.upload-photobank-modal .ant-modal-footer .ant-btn {
  border-radius: 999px !important;
  min-height: 40px;
  padding-left: 22px;
  padding-right: 22px;
}
</style>
