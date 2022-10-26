<script setup>
import { ref, reactive } from "vue";
import { useRoute } from 'vue-router'

import ImageCropper from '../components/ImageCropper.vue'
import BackButton from '../components/BackButton.vue'

import { useGuide } from "../stores/guide"

const useGuideStore = useGuide()
const route = useRoute()

let visibleCropperModal = ref(false)
let delPhotoDialog = ref(false)

let newGuideElementForm = ref(null)

let preview = ref()
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
  const objUrl = URL.createObjectURL(blob);
  preview.value = objUrl;
  formState.image = blob;
}

function delPhoto() {
  preview.value = '';
  delPhotoDialog.value = false;
}

function submit() {
  let fd = new FormData(newGuideElementForm.value);

  fd.set('name', formState.name)
  fd.set('address', formState.address)
  fd.set('phone', formState.phone)
  fd.set('socialMedia', formState.socialMedia)
  fd.set('description', formState.description)

  fd.set('image', formState.image, `${formState.name}-${Date.now()}.png`)

  useGuideStore.createGuideElement(fd, 'toWatch')
}
</script>

<template>
  <div>
    <BackButton :backRoute="'/' + route.query.type" />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <h2>Добавь объект</h2>
        <form action="POST" @submit.prevent="submit" enctype="multipart/form-data" ref="newGuideElementForm">
          <a-row :gutter="[16, 16]">
            <a-col :span="24">
              Название
              <a-input placeholder="Музей" size="large" v-model:value="formState.name"></a-input>
            </a-col>
            <a-col :span="24">
              <a-button @click="visibleCropperModal = true" class="mb-8" type="dashed" block>
                <span class="mdi mdi-12px mdi-plus"></span>
                добавить фото
              </a-button>
              <div class="d-flex ma-2" style="overflow-x: scroll">
                <img :src="preview" alt="" class="ma-4" style="max-width: 200px; cursor: pointer;"
                  @click="delPhotoDialog = true;" />
                <a-modal v-model:visible="delPhotoDialog" :footer="null">
                  <h3>Удалить фото?</h3>
                  <div class="d-flex justify-center">
                    <a-button class="mt-16" type="primary" size="large" @click="delPhoto">Да
                    </a-button>
                  </div>
                </a-modal>
              </div>
            </a-col>
            <a-col :span="24">
              Описание
              <a-textarea placeholder="Более 1000 экспонятов из 25 стран мира" :rows="4"
                v-model:value="formState.description" />
            </a-col>
            <a-col :span="24">
              Адрес
              <a-input placeholder="Калинина 2А" size="large" v-model:value="formState.address" />
            </a-col>
            <a-col :span="24">
              Телефон
              <a-input placeholder="79127528871" size="large" v-model:value="formState.phone" />
            </a-col>
            <a-col :span="24">
              Социальные сети
              <a-input placeholder="https://vk.com/qbitclub" size="large" v-model:value="formState.socialMedia" />
            </a-col>
          </a-row>
          <a-row class="d-flex justify-center">
            <a-col>
              <a-button type="primary" html-type="submit" class="lets_go_btn mt-8" size="large">Отправить</a-button>
            </a-col>
          </a-row>
        </form>
      </a-col>
    </a-row>
    <a-modal v-model:visible="visibleCropperModal" :footer="null">
      <ImageCropper @addImage="addPreview" />
    </a-modal>
  </div>
</template>
