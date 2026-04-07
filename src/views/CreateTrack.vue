<script setup>
import { reactive, ref, watch, onMounted, computed } from 'vue';
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { message } from "ant-design-vue";

import { useRoute, useRouter } from 'vue-router';
import { useAppState } from "../stores/appState";
import BackButton from "../components/BackButton.vue";
import { useAuth } from '../stores/auth';
import { useTracks } from '../stores/track';
import PlaceService from '../service/PlaceService';

const appStore = useAppState();
const userStore = useAuth();
const trackStore = useTracks();
const router = useRouter();
const route = useRoute();

// Поиск мест
const placeSearchQuery = ref('');
const availablePlaces = ref([]);
const isLoadingPlaces = ref(false);

const form = reactive({
  title: '',
  subtitle: '',
  description: '',
  type: 'пешком',
  places: [], // массив _id выбранных мест
  selectedPlaces: [] // массив объектов для отображения
});

const trackTypes = [
  { value: 'пешком' },
  { value: 'на велосипеде' },
  { value: 'на автомобиле' }
];

let formSchema = yup.object({
  title: yup.string().required("заполните поле"),
  subtitle: yup.string().required("заполните поле"),
  type: yup.string().required("заполните поле"),
});

const isValid = computed(() => {
  return form.places.length >= 2;
});

const showCreatePlaceHint = computed(() => {
  return placeSearchQuery.value.trim().length > 2 && !isLoadingPlaces.value && availablePlaces.value.length === 0;
});

const previewPlace = computed(() => form.selectedPlaces[0] || null);
const previewPlaceImage = computed(() => previewPlace.value?.images?.[0] || "");

// Поиск мест
watch(placeSearchQuery, async (newValue) => {
  if (newValue && newValue.length > 2) {
    isLoadingPlaces.value = true;
    try {
      const ownPlacesQuery = {
        author: userStore.user._id,
        $or: [
          { name: { $regex: newValue, $options: 'i' } },
          { category: { $regex: newValue, $options: 'i' } }
        ]
      };

      const [publicPlacesRes, ownPlacesRes] = await Promise.allSettled([
        PlaceService.getForCreateTrip(newValue),
        PlaceService.getAll(1, ownPlacesQuery)
      ]);

      const publicPlaces =
        publicPlacesRes.status === 'fulfilled' && Array.isArray(publicPlacesRes.value?.data)
          ? publicPlacesRes.value.data
          : [];
      const ownPlaces =
        ownPlacesRes.status === 'fulfilled' && Array.isArray(ownPlacesRes.value?.data)
          ? ownPlacesRes.value.data
          : [];

      const mergedPlacesMap = new Map();
      [...publicPlaces, ...ownPlaces].forEach((place) => {
        if (place?._id) {
          mergedPlacesMap.set(place._id, place);
        }
      });

      availablePlaces.value = Array.from(mergedPlacesMap.values()).map(place => ({
        value: place._id,
        label: place.name,
        place: place
      }));
    } catch (error) {
      console.error('Ошибка поиска мест:', error);
      availablePlaces.value = [];
    } finally {
      isLoadingPlaces.value = false;
    }
  } else {
    availablePlaces.value = [];
  }
});

// Добавление места в маршрут
const addPlace = async (selectedValue, option) => {
  const selectedAsString = selectedValue != null ? String(selectedValue) : "";
  const optionValueAsString = option?.value != null ? String(option.value) : "";

  let placeOption =
    availablePlaces.value.find(p => String(p.value) === selectedAsString) ||
    availablePlaces.value.find(p => p.label === selectedAsString) ||
    availablePlaces.value.find(p => String(p.value) === optionValueAsString);

  let place = placeOption?.place || option?.place || null;
  const placeId = String(place?._id || placeOption?.value || option?.value || selectedValue || "");

  if (!place && placeId) {
    try {
      const response = await PlaceService.getById(placeId);
      place = response?.data || null;
    } catch (error) {
      console.error("Ошибка загрузки выбранного места:", error);
    }
  }

  const alreadyAdded = form.places.some((id) => String(id) === placeId);
  if (placeId && place?._id) {
    if (!alreadyAdded) {
      form.places.push(placeId);
      form.selectedPlaces.push(place);
    } else {
      const alreadyInSelected = form.selectedPlaces.some((p) => String(p?._id) === placeId);
      if (!alreadyInSelected) {
        form.selectedPlaces.push(place);
      }
    }
  }

  placeSearchQuery.value = '';
  availablePlaces.value = [];
};

// Удаление места из маршрута
const removePlace = (index) => {
  form.places.splice(index, 1);
  form.selectedPlaces.splice(index, 1);
};

// Перемещение места вверх
const moveUp = (index) => {
  if (index > 0) {
    [form.places[index], form.places[index - 1]] = [form.places[index - 1], form.places[index]];
    [form.selectedPlaces[index], form.selectedPlaces[index - 1]] = [form.selectedPlaces[index - 1], form.selectedPlaces[index]];
  }
};

// Перемещение места вниз
const moveDown = (index) => {
  if (index < form.places.length - 1) {
    [form.places[index], form.places[index + 1]] = [form.places[index + 1], form.places[index]];
    [form.selectedPlaces[index], form.selectedPlaces[index + 1]] = [form.selectedPlaces[index + 1], form.selectedPlaces[index]];
  }
};

const restoreSelectedPlacesFromIds = async () => {
  if (!Array.isArray(form.places) || form.places.length === 0) {
    form.selectedPlaces = [];
    return;
  }

  const restoredPlaces = [];
  for (const placeId of form.places) {
    try {
      const response = await PlaceService.getById(placeId);
      if (response?.data?._id) {
        restoredPlaces.push(response.data);
      }
    } catch (error) {
      console.error("Ошибка восстановления места из localStorage:", error);
    }
  }

  form.selectedPlaces = restoredPlaces;
  form.places = restoredPlaces.map((place) => place._id);
};

async function submit() {
  if (form.places.length < 2) {
    message.config({ duration: 3, top: "70vh" });
    message.warning("Добавьте минимум 2 места в маршрут!");
    return;
  }

  let toSend = {
    title: form.title,
    subtitle: form.subtitle,
    description: form.description,
    type: form.type,
    places: form.places,
    author: userStore.user._id,
    createdDate: Date.now()
  };

  function close() {
    router.push("/tracks-list");
    clearForm();
  }

  function clearForm() {
    Object.assign(form, {
      title: '',
      subtitle: '',
      description: '',
      type: 'пешком',
      places: [],
      selectedPlaces: []
    });
  }

  let response = await trackStore.create(toSend);
  if (response.status == 200) {
    localStorage.removeItem('createTrackForm');
    message.config({ duration: 1.5, top: "70vh" });
    message.success({
      content: "Маршрут создан!",
      onClose: () => {
        close();
      },
    });
  }
}

watch(form, (newForm) => {
  localStorage.setItem('createTrackForm', JSON.stringify({
    title: newForm.title,
    subtitle: newForm.subtitle,
    description: newForm.description,
    type: newForm.type,
    places: newForm.places
  }));
});

onMounted(async () => {
  if (localStorage.getItem('createTrackForm')) {
    const savedForm = JSON.parse(localStorage.getItem('createTrackForm'));
    Object.assign(form, savedForm);
  }
  await restoreSelectedPlacesFromIds();
  if (typeof route.query.placeQuery === 'string' && route.query.placeQuery.trim()) {
    placeSearchQuery.value = route.query.placeQuery;
  }
});
</script>

<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <h2>Создать маршрут</h2>
        <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="submit">
          <a-row :gutter="[16, 16]">
            <a-col :span="24">
              <Field name="title" v-slot="{ value, handleChange }" v-model="form.title">
                Название маршрута
                <a-input placeholder="Название маршрута" @update:value="handleChange" :value="value" :maxlength="100"
                  allow-clear show-count />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="title" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24">
              <Field name="subtitle" v-slot="{ value, handleChange }" v-model="form.subtitle">
                Подзаголовок
                <a-input placeholder="Краткое описание маршрута" @update:value="handleChange" :value="value"
                  :maxlength="150" allow-clear show-count />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="subtitle" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24" style="display: flex; flex-direction: column">
              Подробное описание маршрута
              <QuillEditor class="ql-editor" theme="snow" v-model:content="form.description" contentType="html"
                :toolbar="[
                  ['bold', 'italic', 'underline', { color: ['#000000', '#ff6600', '#3daff5'] }],
                  [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
                  ['link'],
                  ['clean']
                ]" />
            </a-col>

            <a-col :span="24">
              <Field name="type" v-slot="{ value, handleChange }" v-model="form.type">
                Тип маршрута
                <a-select :value="value" @update:value="handleChange" style="width: 100%" :options="trackTypes"
                  placeholder="Выберите тип маршрута" allowClear />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="type" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24">
              Места в маршруте (минимум 2)
              <div class="track-preview-hint">
                Фотография на карточку маршрута подставляется из первого места в списке.
              </div>
              <div v-if="previewPlace" class="track-preview-place">
                <img
                  v-if="previewPlaceImage"
                  :src="previewPlaceImage"
                  :alt="`Превью маршрута: ${previewPlace.name}`"
                  class="track-preview-place__image"
                />
                <div v-else class="track-preview-place__empty">
                  У первого места пока нет фотографии
                </div>
              </div>
              <div class="places-section">
                <!-- Поиск мест -->
                <div class="place-search">
                  <a-auto-complete v-model:value="placeSearchQuery" :options="availablePlaces"
                    placeholder="Начните вводить название места..." style="width: 100%" :loading="isLoadingPlaces"
                    @select="addPlace">
                    <template #option="item">
                      <div>{{ item.label }}</div>
                    </template>
                    <template v-if="showCreatePlaceHint" #notFoundContent>
                      <router-link to="/create-place" target="_blank" class="create-place-hint-link">
                        Создайте место, если не нашли его
                      </router-link>
                    </template>
                  </a-auto-complete>
                </div>

                <!-- Список выбранных мест -->
                <div v-if="form.selectedPlaces.length > 0" class="selected-places mt-4">
                  <a-list :data-source="form.selectedPlaces" bordered>
                    <template #renderItem="{ item, index }">
                      <a-list-item>
                        <template #actions>
                          <a-button size="small" @click="moveUp(index)" :disabled="index === 0"
                            title="Переместить вверх">
                            ↑
                          </a-button>
                          <a-button size="small" @click="moveDown(index)"
                            :disabled="index === form.selectedPlaces.length - 1" title="Переместить вниз">
                            ↓
                          </a-button>
                          <a-button size="small" danger @click="removePlace(index)" title="Удалить">
                            ✕
                          </a-button>
                        </template>
                        <a-list-item-meta>
                          <template #title>
                            <span class="place-number">{{ index + 1 }}.</span> {{ item.name }}
                          </template>
                          <template #description>
                            {{ item.location?.shortName || item.location?.name }}
                          </template>
                        </a-list-item-meta>
                      </a-list-item>
                    </template>
                  </a-list>
                </div>

                <div v-else class="empty-places mt-4">
                  <a-empty description="Добавьте места в маршрут" />
                </div>
              </div>
            </a-col>

            <a-col :span="24" class="d-flex justify-center">
              <a-button class="lets_go_btn ma-36" type="primary" html-type="submit"
                :disabled="!meta.valid || form.description.length < 3 || !isValid">
                Создать маршрут
              </a-button>
            </a-col>
          </a-row>
        </Form>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.places-section {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.places-section h3 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}

.place-search {
  margin-bottom: 16px;
}

.track-preview-hint {
  margin-top: 6px;
  margin-bottom: 10px;
  font-size: 13px;
  color: rgba(18, 32, 51, 0.75);
}

.track-preview-place {
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 102, 0, 0.4);
  background: #fff;
}

.track-preview-place__image {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  display: block;
}

.track-preview-place__empty {
  padding: 12px;
  font-size: 13px;
  color: rgba(18, 32, 51, 0.65);
}

.create-place-hint-link {
  color: #ff6600;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  padding: 6px 0;
}

.selected-places .place-number {
  font-weight: bold;
  color: #4285F4;
  margin-right: 8px;
}

.empty-places {
  padding: 20px;
  text-align: center;
  background: white;
  border-radius: 8px;
}

.error-message {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 4px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(.ql-editor) {
  min-height: 120px;
  background: white;
}

:deep(.ant-list-item-action) {
  margin-left: 16px;
}

:deep(.ant-list-item-action > li) {
  padding: 0 4px;
}
</style>
