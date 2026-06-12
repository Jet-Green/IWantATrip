<script setup>
import { ref, reactive, watch, computed, nextTick, onBeforeUnmount } from "vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const props = defineProps({
  open: { type: Boolean, default: false },
  /** @type {{ location?: object | null; placeNameText?: string; enterpriseName?: string }} */
  initial: { type: Object, default: () => ({}) },
  saving: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "save"]);

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

let suppressMetaLocationTypeReset = false;

const metaMapContainer = ref(null);
/** @type {maplibregl.Map | null} */
let metaMap = null;
/** @type {maplibregl.Marker | null} */
let metaMapMarker = null;

const fetchAddressSuggestions = async (query) => {
  const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
  const res = await fetch(url, {
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
  });
  const data = JSON.parse(await res.text());
  return (data?.suggestions ?? [])
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
    metaMap.flyTo({ center: [longitude, latitude], zoom: 13, duration: 500 });
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

function loadFromInitial(initial) {
  suppressMetaLocationTypeReset = true;
  metaPlaceNameText.value = initial?.placeNameText || "";
  metaEnterpriseName.value = initial?.enterpriseName || "";
  const loc = initial?.location;
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
    metaCustomMapAddressRequest.value = "";
  } else {
    Object.assign(metaLocation, { name: "", shortName: "", type: "Point", coordinates: [] });
    metaLocationType.value = "dadataLocation";
    metaLocationSearchRequest.value = "";
  }
  metaPossibleLocations.value = [];
  metaCustomMapAddressOptions.value = [];
  nextTick(() => {
    suppressMetaLocationTypeReset = false;
    if (metaLocationType.value === "customLocation") {
      destroyMetaMap();
      nextTick(() => {
        initMetaMap();
        if (metaMap && isMetaLocationValid.value) {
          setMetaMapPoint(metaLocation.coordinates[0], metaLocation.coordinates[1], true);
        }
        metaMap?.resize();
      });
    }
  });
}

function close() {
  emit("update:open", false);
}

function submit() {
  const payload = {
    placeNameText: metaPlaceNameText.value || "",
    enterpriseName: metaEnterpriseName.value || "",
    location: null,
  };
  if (isMetaLocationValid.value) {
    payload.location = {
      name: metaLocation.name || "",
      shortName: metaLocation.shortName || "",
      type: "Point",
      coordinates: [...metaLocation.coordinates],
    };
  }
  emit("save", payload);
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      loadFromInitial(props.initial);
    } else {
      destroyMetaMap();
    }
  }
);

watch(metaLocationSearchRequest, async (newValue) => {
  if (metaLocationType.value !== "dadataLocation") return;
  if (newValue.trim().length <= 2) {
    metaPossibleLocations.value = [];
    return;
  }
  try {
    metaPossibleLocations.value = await fetchAddressSuggestions(newValue);
  } catch {
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
  } catch {
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
  if (newType !== "customLocation" || !props.open) return;
  await nextTick();
  initMetaMap();
  if (metaMap) {
    metaMap.resize();
    if (isMetaLocationValid.value) {
      setMetaMapPoint(metaLocation.coordinates[0], metaLocation.coordinates[1], true);
    }
  }
});

watch(
  () => props.open,
  async (open) => {
    if (open) {
      await nextTick();
      metaMap?.resize();
    }
  }
);

onBeforeUnmount(() => {
  destroyMetaMap();
});
</script>

<template>
  <a-modal
    :open="open"
    title="Редактировать данные фото"
    width="min(720px, 96vw)"
    wrap-class-name="photobank-meta-modal"
    :destroy-on-close="true"
    :confirm-loading="saving"
    @update:open="(v) => emit('update:open', v)"
    @cancel="destroyMetaMap"
  >
    <div class="meta-modal">
      <div class="meta-modal__section-title">Место</div>
      <div class="meta-modal__radio">
        <a-radio-group v-model:value="metaLocationType" name="photobankEditMetaLocationType">
          <a-radio value="dadataLocation">Адрес</a-radio>
          <a-radio value="customLocation">Координаты</a-radio>
        </a-radio-group>
      </div>

      <div v-if="metaLocationType === 'dadataLocation'" class="meta-modal__block">
        <a-auto-complete
          v-model:value="metaLocationSearchRequest"
          style="width: 100%"
          :options="metaPossibleLocations"
          placeholder="Начните ввод адреса"
          allow-clear
          @select="selectMetaStartLocation"
        />
      </div>
      <div v-else class="meta-modal__block">
        <a-auto-complete
          v-model:value="metaCustomMapAddressRequest"
          style="width: 100%; margin-bottom: 8px"
          :options="metaCustomMapAddressOptions"
          placeholder="Найти адрес на карте"
          allow-clear
          @select="selectMetaMapAddress"
        />
        <p class="meta-modal__map-hint">Кликните по карте, чтобы выбрать геоточку.</p>
        <div ref="metaMapContainer" class="meta-modal__map"></div>
        <div class="meta-modal__coords">
          <div>Широта (lon): <b>{{ metaLocation.coordinates?.[0] ?? "не выбрано" }}</b></div>
          <div>Долгота (lat): <b>{{ metaLocation.coordinates?.[1] ?? "не выбрано" }}</b></div>
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
      <div class="photobank-meta-modal__footer">
        <a-button shape="round" :disabled="saving" @click="close">Отмена</a-button>
        <a-button type="primary" shape="round" :loading="saving" @click="submit">Сохранить</a-button>
      </div>
    </template>
  </a-modal>
</template>

<style scoped lang="scss">
.meta-modal__section-title {
  font-weight: 700;
  margin: 12px 0 8px;
  color: #122033;
}

.meta-modal__section-title:first-child {
  margin-top: 0;
}

.meta-modal__radio {
  margin-bottom: 12px;
}

.meta-modal__block {
  margin-bottom: 8px;
}

.meta-modal__label {
  font-size: 13px;
  color: rgba(18, 32, 51, 0.75);
  margin: 10px 0 4px;
}

.meta-modal__label:first-of-type {
  margin-top: 0;
}

.meta-modal__map-hint {
  font-size: 13px;
  color: rgba(18, 32, 51, 0.65);
  margin: 0 0 8px;
}

.meta-modal__map {
  width: 100%;
  height: min(40vh, 320px);
  min-height: 220px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 102, 0, 0.45);
}

.meta-modal__coords {
  margin-top: 8px;
  font-size: 13px;
  color: rgba(18, 32, 51, 0.8);
}
</style>

<style lang="scss">
.photobank-meta-modal .photobank-meta-modal__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.photobank-meta-modal .ant-modal-footer .ant-btn {
  border-radius: 999px !important;
  min-height: 40px;
  padding-left: 22px;
  padding-right: 22px;
}
</style>
