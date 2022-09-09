<script setup>
import { ref, reactive } from "vue";
import ImageCropper from '../ImageCropper.vue'

let visibleCropperModal = ref(false)
let delPhotoDialog = ref(false)

let previews = ref([])
const formState = reactive({
  image: '',
  name: '',
  address: '',
  phone: '',
  socialMedia: '',
  description: ''
});

function addPreview(blob) {
  // imagesFormData.append("image", blob, `product-${previews.value.length}`);
  visibleCropperModal.value = false;
  previews.value.push(URL.createObjectURL(blob));
}

function delPhoto(index) {
  previews.value.splice(index, 1);
  delPhotoDialog.value = false;
}

function submit() {
  console.log("submit")
}
</script>

<template>
  <form action="POST" @submit.prevent="submit">
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        Название
        <a-input placeholder="Введите название" size="large" v-model:value="formState.name"></a-input>
      </a-col>
      <a-col :span="24">
        <a-button @click="visibleCropperModal = true" class="mb-8" type="dashed" block>добавить фото
          <span class="mdi mdi-12px mdi-plus"></span>
        </a-button>
        <div class="d-flex ma-2" style="overflow-x: scroll">
          <img v-for="(pr, i) in previews" :key="i" :src="pr" alt="" class="ma-4"
            style="max-width: 200px; cursor: pointer;" @click="delPhotoDialog = true;" />
          <a-modal v-model:visible="delPhotoDialog" :footer="null">
            <h3>Удалить фото?</h3>
            <div class="d-flex justify-center">
              <a-button class="mt-16" type="primary" size="large" @click="delPhoto(i)">Да
              </a-button>
            </div>
          </a-modal>
        </div>
      </a-col>
      <a-col :span="24">
        Описание
        <a-textarea placeholder="Введите описание" :rows="4" v-model:value="formState.description" />
      </a-col>
      <a-col :span="24">
        Адрес
        <a-input placeholder="Введите адрес" size="large" v-model:value="formState.address" />
      </a-col>
      <a-col :span="24">
        Телефон
        <a-input placeholder="Введите телефон" size="large" v-model:value="formState.phone" />
      </a-col>
      <a-col :span="24">
        Социальные сети
        <a-input placeholder="Введите ссылку" size="large" v-model:value="formState.socialMedia" />
      </a-col>
    </a-row>
    <a-row class="d-flex justify-center">
      <a-col>
        <a-button type="primary" html-type="submit" class="lets_go_btn mt-8" size="large">Отправить</a-button>
      </a-col>
    </a-row>

  </form>

  <a-modal v-model:visible="visibleCropperModal" :footer="null">
    <ImageCropper @addImage="addPreview" />
  </a-modal>
</template>
