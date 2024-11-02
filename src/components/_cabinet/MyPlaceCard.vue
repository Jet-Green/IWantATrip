<script setup>
import { toRefs, computed, ref } from 'vue';
import { useRouter } from 'vue-router';

let props = defineProps(['place'])
let emit = defineEmits(['refreshPlaces'])
import { usePlaces } from "../../stores/place"

const router = useRouter()
const placeStore = usePlaces()
let color = ref('black')
// toRefs add reactivity
let { place } = toRefs(props)

let status = computed(() => {
  if (place.value?.isHidden) {
    color.value = 'black'
    return "скрыто"
  }
  if (place.value.isRejected) {
    color.value = '#ff6600'
    return "отказано"
  }
  if (!place.value.isModerated) {
    color.value = '#20A0CF'
    return "на проверке"
  } else   {
    color.value = 'black'
    return "на сайте"
  }
  
})

async function placeToDelete(_id) {
  let response = await placeStore.deletePlace(_id);
  if (response.status == 200) {
    emit('refreshPlaces')
  }
}
async function hideExcursion(_id, isHide) {
  let response = await placeStore.hideExcursion(_id, isHide);
  if (response.status == 200) {
    emit('refreshPlaces')
  }
}
function placeInfo(_id) {
  if (place.value.prices.length == 0) {
    router.push(`/cabinet/place-booking-info?_id=${_id}`)
  } else {
    router.push(`/cabinet/place-info?_id=${_id}`)
  }
}
</script>
<template>
  <a-card class="card" :class="[place.isHidden ? 'overlay' : '']" v-if="place._id">
    <div style="width: 100%; height: 100%; text-align: center; font-weight: 700;">
      {{ place.name }}
    </div>
    <div v-if="place?.category" style="text-align: center;">
      {{ place?.category }}
    </div>

    <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
    <div class="actions">
      <div>
     
        <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="placeToDelete(place._id)">
          <span class="mdi mdi-delete" style="color: #ff6600;"></span>
        </a-popconfirm>
        <a-popconfirm title="Скрыть?" ok-text="Да" cancel-text="Нет"
          @confirm="hideExcursion(place._id, !place.isHidden)">
          <span v-if="!place.isHidden" class="mdi mdi-eye-outline"></span>
          <span v-else class="mdi mdi-eye-off-outline"></span>
        </a-popconfirm>
        <a-popconfirm title="Редактировать?" ok-text="Да" cancel-text="Нет"
          @confirm="router.push(`/edit-place?_id=${place._id}`)">
          <span class="mdi mdi-pen"></span>
        </a-popconfirm>
        <span class="mdi mdi-information-outline" @click="placeInfo(place._id)"></span>
      </div>
      <div :style="{color}" style="font-size:14px">
        {{ status }}
      </div>

    </div>
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

.money-indicator {
  position: absolute;
  top: 0;
  right: 8px;
}

.mdi-cash {
  font-size: 22px;
  cursor: pointer;
}
</style>