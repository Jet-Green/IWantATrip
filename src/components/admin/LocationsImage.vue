<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useLocations } from '../../stores/locations';

let locationStore = useLocations()

let locationSearchRequest = ref("");
let possibleLocations = ref([]);
let location = ref({});
let image = ref({});
let imageURL = ref({});
let showImage = ref(false);

let addImageDialog = ref(false)


function selectStartLocation(selected) {
  for (let l of possibleLocations.value) {
    // l.value - name
    if (l.value == selected) {
      location.value = l.location
    }
  }
}
function clear() {
  location = ref({});
  image = ref({});
  imageURL = ref({});
  showImage = ref(false);
  addImageDialog.value = false
}
let locationWithImg = computed(() => {
  return locationStore.locations.filter((location) => {
    if (location.image) return location

  })
})

watch(locationSearchRequest, async (newValue, oldValue) => {
  if (newValue.trim().length > 2 && newValue.length > oldValue.length) {
    var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

    var options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + import.meta.env.VITE_DADATA_TOKEN
      },
      body: JSON.stringify({
        query: newValue,
        count: 5,
        "from_bound": { "value": "city" },
        "to_bound": { "value": "settlement" }
      })
    }

    let res = await fetch(url, options)
    try {
      let suggestions = JSON.parse(await res.text()).suggestions
      possibleLocations.value = []
      for (let s of suggestions) {
        let location = {
          value: s.value,
          location: {
            name: s.value,
            shortName: '',
            type: 'Point',
            coordinates: [
              s.data.geo_lon,
              s.data.geo_lat
            ]
          }
        }

        if (s.data.settlement) {
          location.location.shortName = s.data.settlement
        }
        else if (s.data.city) {
          location.location.shortName = s.data.city
        } else {
          location.location.shortName = s.value
        }

        possibleLocations.value.push(location)
      }
    } catch (error) {
      console.log(error);
    }
  }
})

async function addPhotoToLocation() {

  await locationStore.createLocation(location.value)
  let res = await locationStore.searchLocation(location.value.name)
  let _id = res.data[0]?._id
  let imagesFormData = new FormData();
  let timeStamp = Date.now()
  imagesFormData.append(
    "location-image",
    new File([image.value], _id + "_" + timeStamp + ".jpg"),
    _id + "_" + timeStamp + ".jpg"
  );
  await locationStore.uploadImage(imagesFormData)
  await locationStore.fetchLocations()
  clear()
}

async function deletePhotoFromLocation(_id) {

  let res = await locationStore.deletePhotoFromLocation(_id)
  if (res.status == 200) {
    await locationStore.fetchLocations()
  }
}

const handleImageChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    // Сохраняем оригинальный файл, если это необходимо
    // image.value = file;

    // Создаем объект Image для загрузки файла
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      const maxWidth = 1000; // Желаемая ширина
      let newWidth = img.width;
      let newHeight = img.height;

      // Если текущая ширина больше желаемой, уменьшаем ее
      if (img.width > maxWidth) {
        newWidth = maxWidth;
        newHeight = img.height * (maxWidth / img.width); // Пропорционально уменьшаем высоту
      }

      // Создаем canvas для ресайза
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Устанавливаем размеры canvas по новым значениям
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Отрисовываем изображение на canvas с новыми размерами
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Конвертируем canvas в Blob и создаем новый URL
      canvas.toBlob((blob) => {
        image.value = blob; // Теперь image.value будет содержать Blob ресайзнутого изображения
        const resizedUrl = URL.createObjectURL(blob);
        imageURL.value = resizedUrl;
        showImage.value = true;

        // Очищаем оригинальный URL объекта
        URL.revokeObjectURL(objectUrl);
      }, 'image/jpeg', 0.8); // Используем JPEG с качеством 80%


    };

    img.onerror = () => {
      console.error('Failed to load image');
      URL.revokeObjectURL(objectUrl);
    };
  }
};
</script>

<template>
  <h3>Добавить изображение к локации</h3>
  <a-col :span="24" class="d-flex">


    <div style="width: 100px; margin: 2px;" v-for="location, index in locationWithImg" :key="index">
      <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет"
        @confirm="() => { deletePhotoFromLocation(location._id) }">
        <div>
          <img style="width: 100%;" :src="location.image" alt="not found">

        </div>
        <div style="font-size: 8px; text-align: center;">{{ location.shortName }}</div>
      </a-popconfirm>
    </div>

  </a-col>
  <a-col :span="24" class="d-flex justify-end"><a-button type="primary" class="ml-12 lets_go_btn"
      @click="addImageDialog = true">добавить</a-button></a-col>
  <a-modal v-model:open="addImageDialog" :footer="null" @cancel="addImageDialog = false">

    <h3>Добавить фотографию для локации</h3>
    <div>Локация</div>
    <div class="d-flex">
      <a-auto-complete v-model:value="locationSearchRequest" size="large" style="width: 100%;"
        :options="possibleLocations" placeholder="Глазов" @select="selectStartLocation"></a-auto-complete>
    </div>
    <div class="upload-container mt-16">
      <label for="image_uploads"> <span class="mdi mdi-24px mdi-paperclip" style="cursor: pointer"></span>Выбери
        фотографию
      </label>
      <input type="file" id="image_uploads" name="image_uploads" accept="image/png, image/jpeg, image/jpg"
        @change="handleImageChange" class="hide-btn mr-16" />
      <img v-if="showImage" :src="imageURL" alt="Cropped Image" />
    </div>
    <div class="d-flex justify-center">
      <a-button type="primary" class="ma-12 lets_go_btn" @click="addPhotoToLocation">отправить</a-button>
    </div>

  </a-modal>

</template>

<style scoped>
.hide-btn {
  display: none;
}

img {
  aspect-ratio: initial;
  width: 300px;
}
</style>