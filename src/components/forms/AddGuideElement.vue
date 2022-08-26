<script setup>
import { ref, reactive } from "vue";
import ImageCropper from '../ImageCropper.vue'

let visibleCropperModal = ref(false)
let previews = ref([])
const formState = reactive({
  image: '',
  name: '',
  phone: '',
  socialMedia: '',
  description: ''
});


function addPreview(blob) {
  // imagesFormData.append("image", blob, `product-${previews.value.length}`);
  visibleCropperModal.value = false;
  previews.value.push(URL.createObjectURL(blob));
}

</script>

<template>
  <a-form :model="formState" name="basic">
    <a-form-item label="Название" name="name" :rules="[{ required: true, message: 'Введите название!' }]">
      <a-input v-model:value="formState.name" />
    </a-form-item>

    <a-form-item label="Фотография" name="photo"
      :rules="[{ required: true, message: 'Введите ссылку на фотографию!' }]">
      <a-button @click="visibleCropperModal = true" type="primary" class="lets_go_btn">добавить фото</a-button>
      <div v-for="(pr, i) in previews" :key="i" class="ma-2">
        <img :src="pr" alt="">
      </div>
    </a-form-item>

    <a-form-item label="Описание" name="description" :rules="[{ required: true, message: 'Введите описание!' }]">
      <a-textarea placeholder="Описание" :rows="4" />
    </a-form-item>

    <a-form-item label="Телефон" name="phone" :rules="[{ required: true, message: 'Введите телефон!' }]">
      <a-input v-model:value="formState.phone" />
    </a-form-item>

    <a-form-item label="Соц. сети" name="socialMedia" :rules="[{ required: true, message: 'Введите ссылку!' }]">
      <a-input v-model:value="formState.socialMedia" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" class="lets_go_btn" size="large">Отправить</a-button>
    </a-form-item>
  </a-form>
  <a-modal v-model:visible="visibleCropperModal" @ok="handleOk" :footer="null">
    <ImageCropper @addImage="addPreview" />
  </a-modal>
</template>
