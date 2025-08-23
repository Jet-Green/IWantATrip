<script setup>
import { ref,watch,onMounted } from 'vue';
import { useLocations } from '../../stores/locations';

let locationStore= useLocations()
let locationSearchRequest = ref("");
let possibleLocations = ref([]);
let location = ref({});
let image = ref({});
let imageURL = ref({});
let showImage = ref(false);

function selectStartLocation(selected) {
  for (let l of possibleLocations.value) {
    // l.value - name
    if (l.value == selected) {
       location.value = l.location
    }
  }
}

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

async function addPhotoToLocation(){
  await locationStore.createLocation(location.value)
  let res = await locationStore.searchLocation(location.value.name)
  let _id= res.data[0]?._id
  let imagesFormData = new FormData();
  imagesFormData.append(
    "location-image",
    new File([image.value], _id + "_" + 0 + ".jpg"),
    _id + "_" + 0 + ".jpg"
  );
  await locationStore.uploadImage(imagesFormData)
}

const handleImageChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    image.value = file;

    // Create an Image object to load the file
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      // Define the crop dimensions for 16:9 aspect ratio
      const cropWidth = 320; // Example width
      const cropHeight = cropWidth * 9 / 16; // Height for 16:9 ratio (e.g., 180 for 320 width)

      // Create a canvas for cropping
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate the center crop coordinates
      const sourceWidth = img.width;
      const sourceHeight = img.height;
      const cropX = (sourceWidth - cropWidth) / 2; // Center horizontally
      const cropY = (sourceHeight - cropHeight) / 2; // Center vertically

      // Set canvas size to the crop dimensions
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // Draw the cropped portion of the image
      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight, // Source rectangle
        0, 0, cropWidth, cropHeight // Destination rectangle
      );

      // Convert canvas to Blob and create a new URL
      canvas.toBlob((blob) => {
        image.value=blob
        const croppedUrl = URL.createObjectURL(blob);
        imageURL.value = croppedUrl;
        showImage.value = true;

        // Clean up the original object URL
        URL.revokeObjectURL(objectUrl);
      }, 'image/jpg', 1); // Use JPEG with 80% quality
    };

    img.onerror = () => {
      console.error('Failed to load image');
      URL.revokeObjectURL(objectUrl);
    };
  }
};
onMounted(async()=>{
  let sus = await locationStore.searchLocation("Свердловская обл, г Североуральск, тер В районе улиц Малышева-Островского")
  console.log(sus)
})
</script>

<template>
  <a-col :span="24">
    <h3>Добавить изображение к локации</h3>
  </a-col>
  <a-col :span="24">
    <div class="inputs-container">
      <div class="d-flex align-center space-between">
        <a-auto-complete
          v-model:value="locationSearchRequest"
          size="large"
          style="width: 100%;"
          :options="possibleLocations"
          placeholder="Глазов"
          @select="selectStartLocation"
        ></a-auto-complete>
        <a-button type="primary" class="ml-12 lets_go_btn" @click="addPhotoToLocation">добавить</a-button>
      </div>
      <div class="upload-container mt-16">
        <label for="image_uploads" class="image-select-button mr-16">Выберите фотографию для локации</label>
        <input
          type="file"
          id="image_uploads"
          name="image_uploads"
          accept="image/png, image/jpeg, image/jpg"
          @change="handleImageChange"
          class="hide-btn mr-16"
        />
        <img v-if="showImage" :src="imageURL" alt="Cropped Image" />
      </div>
    </div>
  </a-col>
</template>

<style scoped>
.hide-btn {
  display: none;
}
img {
  aspect-ratio: initial;
  width: 320px;
}
.image-select-button {
  border-style: solid;
  border-width: 2px;
  border-color: rgb(200, 200, 200);
  width: fit-content;
  padding: 4px;
  transition: border-color 0.5s, transform 0.5s;
}
.image-select-button:hover {
  cursor: pointer;
  transform-origin: center;
  border-color: orange;
  transform: scale(1.01);
}
.inputs-container {
  width: 100%;
}
.upload-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>