<script setup>
import BackButton from "../BackButton.vue";
import { ref, onMounted } from "vue";
import { useGuide } from "../../stores/guide";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

let route = useRoute();
let guideStore = useGuide();
let guide = ref({});
let isModerated = ref(false);
let isLoading = ref(false);
let moderationMessage = ref("");
let router = useRouter();

async function moderateGuide(_id) {
  if (!isModerated.value) {
    isLoading.value = true;
    let res = await guideStore.moderateGuide(_id);

    if (res.status != 400) {
      setTimeout(() => {
        isModerated.value = true;
        isLoading.value = false;
        router.push("/cabinet/moderation-guides/on-moderation");
      }, 500);
    } else {
      isModerated.value = false;
    }
  }
}

async function sendGuideModerationMessage() {
  let res = await guideStore.sendGuideModerationMessage(
    guide.value._id,
    moderationMessage.value
  );
  if (res.status == 200) {
    router.push("/cabinet/moderation-guides/on-moderation");
  }
}

onMounted(async () => {
  let { data } = await guideStore.getGuideById(route.query._id);
  // let { data } = await guideStore.getGuideByEmail('qwerty@qwerty');
  guide.value = data;
  isModerated.value = guide.value.isModerated;
  moderationMessage.value = guide.value.moderationMessage;
});

</script>
<template>
  <div style="overflow-x: hidden">
    <BackButton />
    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16">
        <a-card hoverable style="border-radius: 10px;" class="pa-4">
          <a-card-meta>
            <template #title>
              <div class="d-flex" style="flex-wrap: wrap;">

                <div class="d-flex space-between" style="width: 100%;">
                  <a-avatar :size="40" :src="guide.image" />
                </div>
                <span>{{ guide.name + ' ' + guide.surname }}</span>
              </div>
            </template>

          </a-card-meta>
          <div class="mt-8 card-content">
            <div><b>Краткое описание:</b> {{ guide.offer }}</div>
            <div><b>Описание:</b> {{ guide.description }}</div>

            <div v-if="guide.type"><b>Статус:</b> {{ guide.type }}</div>
            <div v-if="guide.location"><b>Локации:</b> {{ guide.location.name }}</div>
            <div v-if="guide.phone"><b>Тел:</b> {{ guide.phone }}</div>
            <div v-if="guide.email"><b>Email:</b> {{ guide.email }}</div>
            <div v-if="guide.socialMedia"><b>Соц.сеть:</b> <a :href="guide.socialMedia" target="_blank"
                rel="noopener noreferrer">{{ guide.socialMedia }}</a></div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16" class="justify-center d-flex">
        <a-button :loading="isLoading" :disabled="isModerated" @click="moderateGuide(guide._id)"
          class="lets_go_btn ma-36" type="primary">
          <span v-if="!isModerated">принять</span>
          <span v-else class="mdi mdi-check-outline"></span>
        </a-button>
        <a-button :disabled="isModerated" @click="sendGuideModerationMessage"
          class="btn_light ma-36">Отказать</a-button>
      </a-col>
    </a-row>

  </div>
</template>
<style lang="scss" scoped>
img {
  width: 100%;
  aspect-ratio: 270/175;
  object-fit: cover;
}

.ant-carousel :deep(.slick-dots) {
  position: relative;
  height: auto;
}

.ant-carousel :deep(.slick-slide img) {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 100%;
}

.ant-carousel :deep(.slick-thumb) {
  bottom: 0px;
}

.ant-carousel :deep(.slick-thumb li) {
  width: 60px;
  height: 45px;
}

.ant-carousel :deep(.slick-thumb li img) {
  width: 100%;
  // height: 100%;
  filter: grayscale(100%);
  display: block;
}

.ant-carousel :deep(.slick-thumb li.slick-active img) {
  filter: grayscale(0%);
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  color: white;
  line-height: normal;
  width: 50px;
  height: 50px;
  opacity: 1;
  z-index: 1;
  top: 40%;
}
</style>
