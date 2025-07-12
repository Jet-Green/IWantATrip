<script setup>
import { toRefs, computed, ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';


let props = defineProps(['guide'])
let emit = defineEmits(['refreshGuides'])
import { useGuide } from "../../stores/guide"

const router = useRouter()
const guideStore = useGuide()
let color = ref('black')
let show = ref(false)
// toRefs add reactivity
let { guide } = toRefs(props)

let status = computed(() => {
  if (guide.value?.isHidden) {
    color.value = 'black'
    return "скрыто"
  }
  if (guide.value.isRejected) {
    color.value = '#ff6600'
    return "отказано"
  }
  if (!guide.value.isModerated) {
    color.value = '#20A0CF'
    return "на проверке"
  } else {
    color.value = 'black'
    return "на сайте"
  }

})

async function guideToDelete(_id) {
  let response = await guideStore.deleteGuideById(_id); 
  if (response.status == 200) {
    emit('refreshGuides')
  }
}
async function hideGuide(_id) {
  // let response = await guideStore.hidePlace(_id);
  // if (response.status == 200) {
  //   emit('refreshGuides')
  // }
}


</script>
<template>
  <a-card class="card" :class="[guide.isHidden ? 'overlay' : '']" v-if="guide._id">

    <div style=" font-weight: 700;">
      <img :src="guide.image" alt="" style="width: 20%; border-radius: 50%;"> 
      {{ guide.name }} {{ guide.surname }}
    </div>
    <div>тел. {{ guide.phone }}</div>
    <div>локация {{ guide.location }}</div>
    <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
    <div class="actions">
      <div>

        <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="guideToDelete(guide._id)">
          <span class="mdi mdi-delete" style="color: #ff6600;"></span>
        </a-popconfirm>

        <a-popconfirm title="Скрыть/показать?" ok-text="Да" cancel-text="Нет" @confirm="hideGuide(guide._id)">
          <span v-if="!guide.isHidden" class="mdi mdi-eye-outline"></span>
          <span v-else class="mdi mdi-eye-off-outline"></span>
        </a-popconfirm>
        <a-popconfirm title="Редактировать?" ok-text="Да" cancel-text="Нет"
          @confirm="router.push(`/edit-guide?_id=${guide._id}`)">
          <span class="mdi mdi-pen"></span>
        </a-popconfirm>
        <span class="mdi mdi-information-outline" @click="show = !show"></span>
      </div>
      <div :style="{ color }" style="font-size:14px">
        {{ status }}
      </div>

    </div>
    <!-- <a-modal v-model:open="show" :footer="null">
        <PlaceCard :guide="guide" :inCard = true />
      </a-modal> -->
  </a-card>
</template>
<style scoped lang="scss">
.actions {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  cursor: pointer;
  position: relative;
  color: #245159;

  * {
    margin: 4px;
    cursor: pointer;
  }
}

.type {
  display: flex;
  align-items: center;

  span {
    font-size: 20px;
  }
}

.overlay {
  opacity: 0.5;
}
</style>