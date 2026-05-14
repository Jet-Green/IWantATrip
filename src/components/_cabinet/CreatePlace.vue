<script setup>
import { reactive, ref, watch, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import ImageCropper from "../../components/ImageCropper.vue";
import { message } from "ant-design-vue";
import BackButtonAdaptive from "../../components/BackButtonAdaptive.vue";

import { useRouter } from 'vue-router';
import { useAppState } from "../../stores/appState";
import { useAuth } from '../../stores/auth';
import { usePlaces } from '../../stores/place';
import { usePhotos } from '../../stores/photos.js';
import PlaceService from '../../service/PlaceService';

const appStore = useAppState();
const userStore = useAuth();
const placeStore = usePlaces();
const photosStore = usePhotos();
const router = useRouter();
const customMapContainer = ref(null)
let customMap = null
let customMapMarker = null
const customMapAddressRequest = ref("")
const customMapAddressOptions = ref([])
const usePlaceForTrackPrompt = ref(false)
const createdPlaceName = ref("")

const locationType = ref('dadataLocation')
const customLocation = ref({
  type: "Point",
  coordinates: ["", ""]
})

// dadata
let possibleLocations = ref([])
let locationSearchRequest = ref("")
function selectStartLocation(selected) {
  for (let l of possibleLocations.value) {
    // l.value - name
    if (l.value == selected) {
      form.location = l.location
    }
  }
}

function selectMapAddress(selected) {
  for (let l of customMapAddressOptions.value) {
    if (l.value == selected) {
      form.location.name = l.location.name
      form.location.shortName = l.location.shortName
      setCustomMapPoint(l.location.coordinates[0], l.location.coordinates[1], true)
    }
  }
}

//crop and img
const targetIndex = ref(null);
const delPhotoDialog = ref(false);
// cropper
let visibleCropperModal = ref(false);
/** @type {import('vue').Ref<Array<{ kind: 'file'; preview: string; blob: Blob } | { kind: 'photobank'; preview: string; url: string }>>} */
const photoEntries = ref([]);

const photobankModalOpen = ref(false);
const photobankUrls = ref([]);
const photobankPage = ref(1);
const photobankHasMore = ref(false);
const photobankLoading = ref(false);
const photobankLoadingMore = ref(false);
const photobankSearchQuery = ref('');
const photobankSearchActive = ref(false);
const selectedPhotobankUrls = ref([]);

const photobankFullscreenOpen = ref(false);
const photobankFullscreenUrl = ref('');
/** @type {import('vue').Ref<{ url: string; location: object | null; placeNameText: string; enterpriseName: string; caption: string } | null>} */
const photobankFullscreenMeta = ref(null);
const photobankFullscreenWrapRef = ref(null);
const photobankFsMapContainer = ref(null);
/** @type {import('vue').Ref<Record<string, { url: string; location: object | null; placeNameText: string; enterpriseName: string; caption: string }>>} */
const photobankMetaByUrl = ref({});
let photobankFsMap = null;
let photobankFsMarker = null;

const photobankFsShowMap = computed(() => {
  const loc = photobankFullscreenMeta.value?.location;
  return !!(
    loc?.coordinates?.length === 2 &&
    Number.isFinite(Number(loc.coordinates[0])) &&
    Number.isFinite(Number(loc.coordinates[1]))
  );
});

const photobankFsHasDetails = computed(() => {
  const m = photobankFullscreenMeta.value;
  if (!m) return false;
  return !!(
    m.location?.coordinates?.length === 2 ||
    m.placeNameText?.trim() ||
    m.enterpriseName?.trim() ||
    m.caption?.trim()
  );
});

const photobankFsAlreadySelected = computed(
  () => !!photobankFullscreenUrl.value && selectedPhotobankUrls.value.includes(photobankFullscreenUrl.value)
);

function destroyPhotobankFsPreviewMap() {
  if (photobankFsMap) {
    photobankFsMap.remove();
    photobankFsMap = null;
  }
  photobankFsMarker = null;
}

function initPhotobankFsPreviewMap() {
  const el = photobankFsMapContainer.value;
  const loc = photobankFullscreenMeta.value?.location;
  if (!el || !loc?.coordinates || loc.coordinates.length < 2 || photobankFsMap) return;
  const lon = Number(loc.coordinates[0]);
  const lat = Number(loc.coordinates[1]);
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return;

  photobankFsMap = new maplibregl.Map({
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

  photobankFsMap.on('load', () => {
    photobankFsMarker = new maplibregl.Marker({ color: '#ff6600' })
      .setLngLat([lon, lat])
      .addTo(photobankFsMap);
    photobankFsMap?.resize();
    requestAnimationFrame(() => photobankFsMap?.resize());
    setTimeout(() => photobankFsMap?.resize(), 240);
  });
}

function closePhotobankFullscreen() {
  destroyPhotobankFsPreviewMap();
  photobankFullscreenOpen.value = false;
  photobankFullscreenUrl.value = '';
  photobankFullscreenMeta.value = null;
}

function openPhotobankFullscreen(url) {
  destroyPhotobankFsPreviewMap();
  photobankFullscreenUrl.value = url;
  photobankFullscreenMeta.value = photobankMetaByUrl.value[url] ?? normalizePhotobankRow({ url });
  photobankFullscreenOpen.value = true;
}

function confirmPhotobankFullscreen() {
  const url = photobankFullscreenUrl.value;
  if (!url) {
    closePhotobankFullscreen();
    return;
  }
  if (selectedPhotobankUrls.value.includes(url)) {
    closePhotobankFullscreen();
    return;
  }
  selectedPhotobankUrls.value = [...selectedPhotobankUrls.value, url];
  closePhotobankFullscreen();
}

function removePhotobankFromSelectionAndClose() {
  const url = photobankFullscreenUrl.value;
  if (!url) return;
  selectedPhotobankUrls.value = selectedPhotobankUrls.value.filter((u) => u !== url);
  closePhotobankFullscreen();
}

watch(photobankFullscreenOpen, async (open) => {
  if (!open) {
    destroyPhotobankFsPreviewMap();
    return;
  }
  await nextTick();
  await nextTick();
  await nextTick();
  const loc = photobankFullscreenMeta.value?.location;
  if (loc?.coordinates?.length === 2) {
    initPhotobankFsPreviewMap();
    if (!photobankFsMap) {
      await nextTick();
      initPhotobankFsPreviewMap();
    }
    await nextTick();
    photobankFsMap?.resize();
    setTimeout(() => photobankFsMap?.resize(), 220);
  }
  photobankFullscreenWrapRef.value?.focus();
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

function mergePhotobankMetaFromItems(items) {
  if (!Array.isArray(items) || !items.length) return;
  const next = { ...photobankMetaByUrl.value };
  for (const raw of items) {
    const row = normalizePhotobankRow(raw);
    if (row.url) next[row.url] = row;
  }
  photobankMetaByUrl.value = next;
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

function persistPhotoEntries() {
  const urls = photoEntries.value.filter((e) => e.kind === 'photobank').map((e) => e.url);
  localStorage.setItem('createPlacePhotobankUrls', JSON.stringify(urls));
}

async function loadPhotobankBrowsePage(pageNum) {
  photobankLoading.value = true;
  try {
    const res = await photosStore.getPhotos(pageNum);
    const { urls, items, hasMore } = parsePhotosPayload(res);
    photobankUrls.value = urls;
    photobankMetaByUrl.value = {};
    mergePhotobankMetaFromItems(items);
    photobankPage.value = pageNum;
    photobankHasMore.value = hasMore;
    photobankSearchActive.value = false;
  } catch {
    message.error('Не удалось загрузить фотобанк');
  } finally {
    photobankLoading.value = false;
  }
}

async function loadPhotobankSearchPage(pageNum) {
  const q = photobankSearchQuery.value.trim();
  if (!q) {
    await loadPhotobankBrowsePage(1);
    return;
  }
  photobankLoading.value = true;
  try {
    const res = await photosStore.searchPhotos(q, pageNum);
    const { urls, items, hasMore } = parsePhotosPayload(res);
    photobankUrls.value = urls;
    photobankMetaByUrl.value = {};
    mergePhotobankMetaFromItems(items);
    photobankPage.value = pageNum;
    photobankHasMore.value = hasMore;
    photobankSearchActive.value = true;
  } catch {
    message.error('Не удалось выполнить поиск');
  } finally {
    photobankLoading.value = false;
  }
}

function resetPhotobankModalState() {
  closePhotobankFullscreen();
  photobankSearchQuery.value = '';
  photobankSearchActive.value = false;
  selectedPhotobankUrls.value = [];
  photobankPage.value = 1;
  photobankUrls.value = [];
  photobankMetaByUrl.value = {};
  photobankHasMore.value = false;
}

function openPhotobankModal() {
  photobankModalOpen.value = true;
}

watch(photobankModalOpen, (open) => {
  if (open) {
    resetPhotobankModalState();
    loadPhotobankBrowsePage(1);
  } else {
    closePhotobankFullscreen();
  }
});

function runPhotobankSearch() {
  closePhotobankFullscreen();
  selectedPhotobankUrls.value = [];
  if (!photobankSearchQuery.value.trim()) {
    loadPhotobankBrowsePage(1);
    return;
  }
  loadPhotobankSearchPage(1);
}

function clearPhotobankSearch() {
  closePhotobankFullscreen();
  photobankSearchQuery.value = '';
  selectedPhotobankUrls.value = [];
  loadPhotobankBrowsePage(1);
}

async function loadMorePhotobank() {
  if (photobankLoadingMore.value || !photobankHasMore.value) return;
  photobankLoadingMore.value = true;
  try {
    const nextPage = photobankPage.value + 1;
    const res = photobankSearchActive.value
      ? await photosStore.searchPhotos(photobankSearchQuery.value.trim(), nextPage)
      : await photosStore.getPhotos(nextPage);
    const { urls: chunk, items, hasMore } = parsePhotosPayload(res);
    if (chunk.length) {
      photobankUrls.value = [...photobankUrls.value, ...chunk];
      mergePhotobankMetaFromItems(items);
      photobankPage.value = nextPage;
    }
    photobankHasMore.value = chunk.length ? hasMore : false;
  } catch {
    message.error('Не удалось подгрузить фото');
  } finally {
    photobankLoadingMore.value = false;
  }
}

function isPhotobankUrlSelected(url) {
  return selectedPhotobankUrls.value.includes(url);
}

function addSelectedPhotobankToPlace() {
  const urls = [...selectedPhotobankUrls.value];
  if (!urls.length) {
    message.warning('Выберите хотя бы одно фото');
    return;
  }
  for (const url of urls) {
    photoEntries.value.push({ kind: 'photobank', url, preview: url });
  }
  persistPhotoEntries();
  photobankModalOpen.value = false;
  message.success(urls.length === 1 ? 'Фото добавлено' : `Добавлено фото: ${urls.length}`);
}

const form = reactive({
  name: '',
  location: { name: "", shortName: "", type: "Point", coordinates: [] },
  images: [],
  shortDescription: '',
  description: '',
  advicesForTourists: '',
  openingHours: '',
  price: '',
  website: '',
  phone: '',

  category: ''
});

let placeCategory = appStore.appState[0]?.placeCategory.map((name) => { return { value: name } }) ?? []

let formSchema = yup.object({
  name: yup.string().required("заполните поле"),
  shortDescription: yup.string().required("заполните поле"),
  // openingHours: yup.string().required("заполните поле"),
  // website: yup.string().required("заполните поле"),
  // phone: yup.string().required("заполните поле"),
  // price: yup.string().required("заполните поле"),
  category: yup.string().required("заполните поле"),
  // https://vee-validate.logaretm.com/v4/examples/array-fields/
});

let isLocationValid = computed(() => {
  return form.location?.coordinates?.length == 2
})

const getInitialMapCenter = () => {
  if (isLocationValid.value) {
    return [Number(form.location.coordinates[0]), Number(form.location.coordinates[1])]
  }
  return [37.6176, 55.7558]
}

const setCustomMapPoint = (lon, lat, shouldFly = false) => {
  const longitude = Number(Number(lon).toFixed(6))
  const latitude = Number(Number(lat).toFixed(6))
  form.location.type = "Point"
  form.location.coordinates = [longitude, latitude]

  if (!customMap) return

  if (!customMapMarker) {
    customMapMarker = new maplibregl.Marker({ color: '#ff6600' })
      .setLngLat([longitude, latitude])
      .addTo(customMap)
  } else {
    customMapMarker.setLngLat([longitude, latitude])
  }

  if (shouldFly) {
    customMap.flyTo({
      center: [longitude, latitude],
      zoom: 13,
      duration: 500
    })
  }
}

const initCustomMap = () => {
  if (!customMapContainer.value || customMap) return

  customMap = new maplibregl.Map({
    container: customMapContainer.value,
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'osm',
          type: 'raster',
          source: 'osm'
        }
      ]
    },
    center: getInitialMapCenter(),
    zoom: isLocationValid.value ? 13 : 10
  })

  customMap.on('load', () => {
    if (isLocationValid.value) {
      setCustomMapPoint(form.location.coordinates[0], form.location.coordinates[1])
    }
  })

  customMap.on('click', (e) => {
    setCustomMapPoint(e.lngLat.lng, e.lngLat.lat)
  })
}

const fetchAddressSuggestions = async (query) => {
  const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Token " + import.meta.env.VITE_DADATA_TOKEN
    },
    body: JSON.stringify({
      query,
      count: 5,
      "from_bound": { "value": "city" },
      "to_bound": { "value": "house" }
    })
  }

  const res = await fetch(url, options)
  const data = JSON.parse(await res.text())
  const suggestions = data?.suggestions ?? []
  return suggestions
    .filter((s) => s?.data?.geo_lon && s?.data?.geo_lat)
    .map((s) => {
      let shortName = s.value
      if (s.data.settlement) shortName = s.data.settlement
      else if (s.data.city) shortName = s.data.city

      return {
        value: s.value,
        location: {
          name: s.value,
          shortName,
          type: 'Point',
          coordinates: [
            Number(s.data.geo_lon),
            Number(s.data.geo_lat)
          ]
        }
      }
    })
}

async function uploadPlaceImages(_id) {
  const fd = new FormData();
  let fileIndex = 0;
  const photobankUrlsToPush = [];

  for (const entry of photoEntries.value) {
    if (entry.kind === 'file') {
      const name = `${_id}_${Date.now()}_${fileIndex}.jpg`;
      fd.append('place-image', new File([entry.blob], name), name);
      fileIndex++;
    } else if (entry.kind === 'photobank') {
      photobankUrlsToPush.push(entry.url);
    }
  }

  let uploadOk = true;

  if (fileIndex > 0) {
    try {
      const res = await PlaceService.uploadPlaceImages(fd);
      uploadOk = res.status == 200;
    } catch {
      uploadOk = false;
    }
  }

  if (photobankUrlsToPush.length) {
    try {
      const res2 = await PlaceService.pushPhotobankImageUrls(_id, photobankUrlsToPush);
      uploadOk = uploadOk && res2.status == 200;
    } catch {
      uploadOk = false;
    }
  }

  localStorage.removeItem('createPlaceImages');
  localStorage.removeItem('createPlacePhotobankUrls');
  return { status: uploadOk ? 200 : 400 };
}

async function submit() {
  // провериьть на наличие координат вывести предупреждение
  // добавить дату и автора
  // create -> upload-images
  // clear localStorage

  if (form.location.coordinates.length < 2 || form.location.coordinates[0] == '' || form.location.coordinates[1] == '') {
    message.config({ duration: 3, top: "70vh" });
    message.warning("Укажите широту и долготу!");
    return
  }


  let toSend = { ...form }
  toSend.author = userStore.user._id
  toSend.createdDate = Date.now()

  try {
    let response = await placeStore.create(toSend)
    if (response.status == 200) {
      const placeId = response.data._id
      let uploadOk = true

      if (photoEntries.value.length > 0) {
        try {
          let res = await uploadPlaceImages(placeId)
          uploadOk = res.status == 200
        } catch (error) {
          console.log(error)
          uploadOk = false
        }
      }

      localStorage.removeItem('createPlaceForm')
      localStorage.removeItem('createPlaceImages')
      localStorage.removeItem('createPlacePhotobankUrls')
      createdPlaceName.value = form.name
      message.config({ duration: 2, top: "70vh" })
      message.success("Место создано!")
      if (!uploadOk) {
        message.warning("Место сохранено, но фото не загрузились. Проверьте изображения и повторите.")
      }
      usePlaceForTrackPrompt.value = true
    } else {
      message.error("Не удалось создать место")
    }
  } catch (error) {
    console.log(error)
    message.error("Ошибка при создании места")
  }
}

function clearForm() {
  for (const e of photoEntries.value) {
    if (e.kind === 'file' && e.preview?.startsWith('blob:')) {
      URL.revokeObjectURL(e.preview);
    }
  }
  Object.assign(form, {
    name: '',
    location: { name: "", shortName: "", type: "Point", coordinates: [] },
    images: [],
    shortDescription: '',
    description: '',
    advicesForTourists: '',
    openingHours: '',
    price: '',
    website: '',
    category: '',
    phone: ''
  });
  photoEntries.value = [];
  localStorage.removeItem('createPlaceForm')
  localStorage.removeItem('createPlaceImages')
  localStorage.removeItem('createPlacePhotobankUrls')
}

function closeUsePlacePrompt() {
  usePlaceForTrackPrompt.value = false
  clearForm()
  router.push("/places")
}

function continueToCreateTrack() {
  const placeQuery = createdPlaceName.value
  usePlaceForTrackPrompt.value = false
  clearForm()
  router.push({
    path: "/create-track",
    query: { placeQuery }
  })
}


function addPreview(blob) {
  visibleCropperModal.value = false;
  photoEntries.value.push({
    kind: 'file',
    blob,
    preview: URL.createObjectURL(blob),
  });
  persistPhotoEntries();
}

function openDelPhoto(i) {
  targetIndex.value = i;
  delPhotoDialog.value = true;
}

const delPhoto = () => {
  const i = targetIndex.value;
  if (i === null || i === undefined) return;
  const entry = photoEntries.value[i];
  if (entry?.kind === 'file' && entry.preview?.startsWith('blob:')) {
    URL.revokeObjectURL(entry.preview);
  }
  photoEntries.value.splice(i, 1);
  delPhotoDialog.value = false;
  persistPhotoEntries();
};

function handleImgError(i) {
  const entry = photoEntries.value[i];
  if (entry?.kind === 'file' && entry.preview?.startsWith('blob:')) {
    URL.revokeObjectURL(entry.preview);
  }
  photoEntries.value.splice(i, 1);
  persistPhotoEntries();
}


watch(locationSearchRequest, async (newValue) => {
  if (locationType.value !== 'dadataLocation') return
  if (newValue.trim().length <= 2) {
    possibleLocations.value = []
    return
  }
  try {
    possibleLocations.value = await fetchAddressSuggestions(newValue)
  } catch (error) {
    console.log(error)
    possibleLocations.value = []
  }
})

watch(customMapAddressRequest, async (newValue) => {
  if (locationType.value !== 'customLocation') return
  if (newValue.trim().length <= 2) {
    customMapAddressOptions.value = []
    return
  }
  try {
    customMapAddressOptions.value = await fetchAddressSuggestions(newValue)
  } catch (error) {
    console.log(error)
    customMapAddressOptions.value = []
  }
})

watch(locationType, () => {
  form.location = { name: "", shortName: "", type: "Point", coordinates: [] }
  customMapAddressRequest.value = ""
  customMapAddressOptions.value = []
  // if (locationType.value == 'dadataLocation') {
  //   form.location = { name: "", shortName: "", type: "Point", coordinates: [] }
  // } else {
  //   form.customLocation = customLocation.value
  //   form.dadataLocation = {}
  //   possibleLocations.value = []
  //   locationSearchRequest.value = ""
  // }
})

watch(locationType, async (newType) => {
  if (newType !== 'customLocation') return
  await nextTick()
  initCustomMap()
  if (customMap) {
    customMap.resize()
    if (isLocationValid.value) {
      setCustomMapPoint(form.location.coordinates[0], form.location.coordinates[1], true)
    }
  }
})

watch(form, (newForm) => {
  localStorage.setItem('createPlaceForm', JSON.stringify(newForm))
})
onMounted(() => {
  photoEntries.value = [];
  if (localStorage.getItem('createPlaceForm')) {
    Object.assign(form, JSON.parse(localStorage.getItem('createPlaceForm')));
  }
  const rawPb = localStorage.getItem('createPlacePhotobankUrls');
  if (rawPb) {
    try {
      const urls = JSON.parse(rawPb);
      if (Array.isArray(urls)) {
        for (const u of urls) {
          if (typeof u === 'string' && u.trim()) {
            photoEntries.value.push({ kind: 'photobank', url: u, preview: u });
          }
        }
      }
    } catch {
      /* ignore */
    }
  }
})

onBeforeUnmount(() => {
  destroyPhotobankFsPreviewMap();
  if (customMap) {
    customMap.remove()
    customMap = null
  }
  customMapMarker = null
})

</script>
<template>
  <div>
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <BackButtonAdaptive />
        <h2>Создать место</h2>
        <p class="create-place-hint">
          Добавленные места можно использовать при
          <router-link to="/create-track" target="_blank" class="create-place-link">
            создании маршрутов
          </router-link>.
        </p>
        <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="submit">
          <a-row :gutter="[16, 16]">
            <a-col :span="24">
              <Field name="name" v-slot="{ value, handleChange }" v-model="form.name">
                Название
                <a-input placeholder="Название места" @update:value="handleChange" :value="value" :maxlength="50"
                  allow-clear show-count></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="name" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">

              <Field name="shortDescription" v-slot="{ value, handleChange }" v-model="form.shortDescription">
                Короткое описание
                <a-textarea placeholder="Кратко о месте" @update:value="handleChange" :value="value" :maxlength="200"
                  allow-clear show-count></a-textarea>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="shortDescription" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24" style="display: flex; flex-direction: column">
              Подробное описанние
              <QuillEditor class="ql-editor" theme="snow" ref="quill" v-model:content="form.description"
                contentType="html" :toolbar="[
                  ['bold', 'italic', 'underline', { color: ['#000000', '#ff6600', '#3daff5'] }],
                  [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
                  ['link'], ['clean']
                ]
                  " />
            </a-col>
            <a-col :span="24" style="display: flex; flex-direction: column">
              Советы туристам
              <QuillEditor class="ql-editor" theme="snow" ref="quill" v-model:content="form.advicesForTourists"
                contentType="html" :toolbar="[
                  ['bold', 'italic', 'underline', { color: ['#000000', '#ff6600', '#3daff5'] }],
                  [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
                  ['link'], ['clean']
                ]
                  " />
            </a-col>

            <a-col :span="24">
              <Field name="category" v-slot="{ value, handleChange }" v-model="form.category">
                Категория места
                <a-select :value="value" @update:value="handleChange" style="width: 100%" :options="placeCategory"
                  placeholder="Музей, памятник" show-search allowClear>
                </a-select>

              </Field>
              <Transition name="fade">
                <ErrorMessage name="category" class="error-message" />
              </Transition>
            </a-col>


            <a-col :span="24" class="mt-4">
              <Field name="openingHours" v-slot="{ value, handleChange }" v-model="form.openingHours">
                Время работы
                <a-input placeholder="расписание, время работы" @update:value="handleChange" :value="value"
                  :maxlength="100" allow-clear show-count></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="openingHours" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24">
              <Field name="price" v-slot="{ value, handleChange }" v-model="form.price">
                Цена
                <a-input placeholder="взрослый - 100 рублей" @update:value="handleChange" :value="value"
                  :maxlength="100" allow-clear show-count></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="price" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">
              <Field name="phone" v-slot="{ value, handleChange }" v-model="form.phone">
                Телефон
                <a-input placeholder="8919999999" @update:value="handleChange" :value="value" allow-clear
                  show-count></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="phone" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">
              <Field name="website" v-slot="{ value, handleChange }" v-model="form.website">
                Сайт/соц.сеть
                <a-input placeholder="https://example.com" @update:value="handleChange" :value="value" :maxlength="50"
                  allow-clear show-count></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="website" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">
              <div>Адрес или координаты</div>
              <div class="mt-4 mb-4">
                <a-radio-group v-model:value="locationType" name="radioGroup">
                  <a-radio value="dadataLocation">Адрес</a-radio>
                  <a-radio value="customLocation">Координаты</a-radio>
                </a-radio-group>
              </div>
              <div v-if="locationType == 'dadataLocation'">
                <Field name="location" v-slot="{ value, handleChange }" v-model="locationSearchRequest">
                  <a-auto-complete :value="value" @update:value="handleChange" style="width: 100%"
                    :options="possibleLocations" placeholder="Глазов" @select="selectStartLocation">
                  </a-auto-complete>
                </Field>
                <Transition name="fade">
                  <ErrorMessage name="location" class="error-message" />
                </Transition>
              </div>
              <div v-else>
                <a-auto-complete v-model:value="customMapAddressRequest" style="width: 100%; margin-bottom: 8px"
                  :options="customMapAddressOptions" placeholder="Найти адрес на карте" allow-clear
                  @select="selectMapAddress" />
                <p class="create-place-map-hint">
                  Кликните по карте, чтобы выбрать геоточку.
                </p>
                <div ref="customMapContainer" class="create-place-map"></div>
                <div class="create-place-coords">
                  <div>Широта (lon): <b>{{ form.location.coordinates?.[0] ?? 'не выбрано' }}</b></div>
                  <div>Долгота (lat): <b>{{ form.location.coordinates?.[1] ?? 'не выбрано' }}</b></div>
                </div>
              </div>
            </a-col>

            <a-col :xs="24">
              Фотографии
              <div class="d-flex" style="overflow-x: scroll">
                <div
                  v-for="(entry, i) in photoEntries"
                  :key="`${entry.kind}-${i}-${entry.preview}`"
                  class="create-place-photo-thumb-wrap ma-4"
                  @click="openDelPhoto(i)"
                >
                  <img :src="entry.preview" alt="" class="create-place-photo-thumb" @error="handleImgError(i)" />
                  <span v-if="entry.kind === 'photobank'" class="create-place-photo-badge">фотобанк</span>
                </div>
              </div>
              <div class="create-place-photos-actions">
                <a-button type="dashed" block @click="visibleCropperModal = true" class="ma-8">
                  <span class="mdi mdi-12px mdi-plus"></span>
                  Добавить фото
                </a-button>
                <a-button type="dashed" block class="ma-8" @click="openPhotobankModal">
                  <span class="mdi mdi-image-multiple-outline mdi-18px" style="margin-right: 6px" aria-hidden="true"></span>
                  Из фотобанка
                </a-button>
              </div>
            </a-col>
            <a-col :span="24" class="d-flex justify-center">
              <a-button class="lets_go_btn ma-36" type="primary" html-type="submit"
                :disabled="!meta.valid || form.advicesForTourists.length < 3 || form.description.length < 3 || !isLocationValid">Отправить
              </a-button>
            </a-col>
          </a-row>
        </Form>
        <a-modal v-model:open="visibleCropperModal" :footer="null" :destroyOnClose="true">
          <ImageCropper :aspectRatio="2 / 1" @addImage="addPreview" />
        </a-modal>
        <a-modal
          v-model:open="photobankModalOpen"
          title="Выберите фото из фотобанка"
          width="min(980px, 96vw)"
          :footer="null"
          :destroyOnClose="true"
        >
          <div class="create-place-photobank-toolbar">
            <a-input-search
              v-model:value="photobankSearchQuery"
              placeholder="Поиск по URL, ключу или подписи"
              allow-clear
              enter-button="Найти"
              size="large"
              @search="runPhotobankSearch"
            />
            <a-button v-if="photobankSearchActive || photobankSearchQuery.trim()" type="link" class="create-place-photobank-all" @click="clearPhotobankSearch">
              Все фото
            </a-button>
          </div>
          <a-spin :spinning="photobankLoading">
            <div
              v-if="!photobankLoading && !photobankUrls.length"
              class="create-place-photobank-empty"
            >
              {{ photobankSearchActive ? 'Ничего не найдено' : 'В фотобанке пока нет фотографий' }}
            </div>
            <template v-else-if="!photobankLoading && photobankUrls.length">
              <div class="create-place-photobank-grid">
                <div
                  v-for="(url, idx) in photobankUrls"
                  :key="`${url}-${idx}`"
                  class="create-place-photobank-cell"
                  :class="{ 'create-place-photobank-cell--selected': isPhotobankUrlSelected(url) }"
                  role="button"
                  tabindex="0"
                  @click="openPhotobankFullscreen(url)"
                  @keydown.enter.prevent="openPhotobankFullscreen(url)"
                >
                  <img :src="url" alt="" loading="lazy" />
                  <span class="create-place-photobank-check mdi mdi-check-bold" aria-hidden="true"></span>
                </div>
              </div>
              <div v-if="photobankHasMore" class="create-place-photobank-more">
                <a-button shape="round" :loading="photobankLoadingMore" @click="loadMorePhotobank">
                  ещё
                </a-button>
              </div>
            </template>
          </a-spin>
          <div class="create-place-photobank-footer">
            <span class="create-place-photobank-count">Выбрано: {{ selectedPhotobankUrls.length }}</span>
            <div class="create-place-photobank-footer-btns">
              <a-button @click="photobankModalOpen = false">Отмена</a-button>
              <a-button type="primary" :disabled="!selectedPhotobankUrls.length" @click="addSelectedPhotobankToPlace">
                Добавить выбранные
              </a-button>
            </div>
          </div>
        </a-modal>
        <a-modal v-model:open="delPhotoDialog" :footer="null">
          <h3>Удалить фото?</h3>
          <div class="d-flex justify-center">
            <a-button class="mt-16" type="primary" size="large" @click="delPhoto">Да
            </a-button>
          </div>
        </a-modal>
        <a-modal
          v-model:open="usePlaceForTrackPrompt"
          title="Место создано"
          :footer="null"
          class="post-create-place-modal"
          @cancel="closeUsePlacePrompt"
        >
          <p>Используем это место для создания маршрута?</p>
          <div class="d-flex justify-end mt-16 post-create-place-modal__actions" style="gap: 8px;">
            <a-button @click="closeUsePlacePrompt">Нет, позже</a-button>
            <a-button type="primary" @click="continueToCreateTrack">Да, создать маршрут</a-button>
          </div>
        </a-modal>

      </a-col>
    </a-row>

    <Teleport to="body">
      <Transition name="cp-photobank-fs">
        <div
          v-if="photobankFullscreenOpen"
          ref="photobankFullscreenWrapRef"
          class="create-place-photobank-fs"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фото из фотобанка"
          tabindex="-1"
          @click.self="closePhotobankFullscreen"
          @keydown.escape.prevent="closePhotobankFullscreen"
        >
          <div class="create-place-photobank-fs__panel" @click.stop>
            <img class="create-place-photobank-fs__img" :src="photobankFullscreenUrl" alt="" />
            <div v-if="photobankFsHasDetails && photobankFullscreenMeta" class="create-place-photobank-fs__details">
              <template v-if="photobankFullscreenMeta.location?.coordinates?.length === 2">
                <div class="create-place-photobank-fs__detail-line">
                  {{ photobankFullscreenMeta.location.name?.trim() || 'Точка на карте' }}
                </div>
                <div class="create-place-photobank-fs__detail-line create-place-photobank-fs__detail-line--muted">
                  {{ Number(photobankFullscreenMeta.location.coordinates[0]).toFixed(5) }},
                  {{ Number(photobankFullscreenMeta.location.coordinates[1]).toFixed(5) }}
                </div>
              </template>
              <div v-if="photobankFullscreenMeta.placeNameText?.trim()" class="create-place-photobank-fs__detail-line">
                Место (текст): {{ photobankFullscreenMeta.placeNameText.trim() }}
              </div>
              <div v-if="photobankFullscreenMeta.enterpriseName?.trim()" class="create-place-photobank-fs__detail-line">
                Предприятие: {{ photobankFullscreenMeta.enterpriseName.trim() }}
              </div>
              <div v-if="photobankFullscreenMeta.caption?.trim()" class="create-place-photobank-fs__detail-line">
                {{ photobankFullscreenMeta.caption.trim() }}
              </div>
            </div>
            <div
              v-if="photobankFsShowMap"
              ref="photobankFsMapContainer"
              class="create-place-photobank-fs__map"
              role="presentation"
            />
            <p v-if="photobankFsAlreadySelected" class="create-place-photobank-fs__hint">Уже в выбранных</p>
            <div class="create-place-photobank-fs__actions">
              <a-button shape="round" size="large" @click="closePhotobankFullscreen">Отмена</a-button>
              <a-button
                v-if="photobankFsAlreadySelected"
                shape="round"
                size="large"
                danger
                @click="removePhotobankFromSelectionAndClose"
              >
                Снять выбор
              </a-button>
              <a-button
                v-else
                type="primary"
                shape="round"
                size="large"
                @click="confirmPhotobankFullscreen"
              >
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
.create-place-photos-actions {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.create-place-photobank-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-bottom: 16px;
}

.create-place-photobank-toolbar :deep(.ant-input-search) {
  flex: 1 1 220px;
  min-width: 0;
}

.create-place-photobank-all {
  flex-shrink: 0;
  padding-inline: 4px;
}

.create-place-photobank-empty {
  text-align: center;
  padding: 40px 16px;
  color: rgba(0, 0, 0, 0.45);
}

.create-place-photobank-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
  gap: 14px;
  max-height: 52vh;
  overflow-y: auto;
  padding: 4px 2px 12px;
}

.create-place-photobank-cell {
  position: relative;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  background: #fafafa;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.create-place-photobank-cell:hover {
  border-color: #ff6600;
}

.create-place-photobank-cell:focus-visible {
  outline: 2px solid #ff6600;
  outline-offset: 2px;
}

.create-place-photobank-cell--selected {
  border-color: #ff6600;
  box-shadow: 0 0 0 1px rgba(255, 102, 0, 0.35);
}

.create-place-photobank-cell img {
  width: 100%;
  height: 168px;
  object-fit: cover;
  display: block;
  animation: create-place-pb-thumb-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes create-place-pb-thumb-in {
  from {
    opacity: 0;
    transform: scale(1.05);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.create-place-photobank-check {
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

.create-place-photobank-cell--selected .create-place-photobank-check {
  background: #ff6600;
  color: #fff;
}

.create-place-photobank-more {
  display: flex;
  justify-content: center;
  padding-top: 12px;
}

.create-place-photobank-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.create-place-photobank-count {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.create-place-photobank-footer-btns {
  display: flex;
  gap: 8px;
}

.create-place-photobank-fs {
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

.create-place-photobank-fs__panel {
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

.create-place-photobank-fs__img {
  max-width: 100%;
  max-height: min(44vh, 440px);
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
  align-self: center;
}

.create-place-photobank-fs__details {
  width: 100%;
  max-width: 640px;
  align-self: center;
  text-align: left;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.create-place-photobank-fs__detail-line {
  font-size: 14px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.94);
  word-break: break-word;
}

.create-place-photobank-fs__detail-line + .create-place-photobank-fs__detail-line {
  margin-top: 6px;
}

.create-place-photobank-fs__detail-line--muted {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.62);
}

.create-place-photobank-fs__map {
  width: 100%;
  max-width: 720px;
  align-self: center;
  height: 280px;
  min-height: 200px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid rgba(255, 102, 0, 0.55);
}

.create-place-photobank-fs__hint {
  margin: 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  align-self: center;
}

.create-place-photobank-fs__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 16px;
  align-self: center;
}

.cp-photobank-fs-enter-active,
.cp-photobank-fs-leave-active {
  transition: opacity 0.28s ease;
}

.cp-photobank-fs-enter-from,
.cp-photobank-fs-leave-to {
  opacity: 0;
}

.cp-photobank-fs-enter-active .create-place-photobank-fs__panel,
.cp-photobank-fs-leave-active .create-place-photobank-fs__panel {
  transition:
    transform 0.38s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.32s ease;
}

.cp-photobank-fs-enter-from .create-place-photobank-fs__panel,
.cp-photobank-fs-leave-to .create-place-photobank-fs__panel {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.create-place-photo-thumb-wrap {
  position: relative;
  flex-shrink: 0;
  cursor: pointer;
}

.create-place-photo-thumb {
  max-width: 200px;
  max-height: 140px;
  width: auto;
  height: auto;
  display: block;
  border-radius: 8px;
  border: 1px solid #eee;
}

.create-place-photo-badge {
  position: absolute;
  bottom: 6px;
  left: 6px;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  text-transform: lowercase;
}

.create-place-hint {
  margin: -6px 0 16px;
  font-size: 14px;
  color: rgba(18, 32, 51, 0.82);
}

.create-place-link {
  color: #ff6600;
  text-decoration: underline;
  text-decoration-color: #ff6600;
  text-underline-offset: 2px;
  font-weight: 600;
}

.create-place-map-hint {
  margin-bottom: 8px;
  color: rgba(18, 32, 51, 0.75);
}

.create-place-map {
  width: 100%;
  height: 320px;
  border: 1px solid #ff6600;
  border-radius: 10px;
  overflow: hidden;
}

.create-place-coords {
  margin-top: 8px;
  display: grid;
  gap: 4px;
  font-size: 13px;
}

.post-create-place-modal__actions :deep(.ant-btn) {
  border-radius: 999px;
}
</style>