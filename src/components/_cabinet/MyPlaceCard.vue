<script setup>
import { toRefs, computed, ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import PlaceCard from '../cards/PlaceCard.vue';

let props = defineProps(['place'])
let emit = defineEmits(['refreshPlaces'])
import { usePlaces } from "../../stores/place"

const router = useRouter()
const placeStore = usePlaces()
let color = ref('black')
let show = ref(false)
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
  } else {
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
async function hidePlace(_id) {
  let response = await placeStore.hidePlace(_id);
  if (response.status == 200) {
    emit('refreshPlaces')
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
          <MdiIcon style="color: #ff6600;" name="delete" />
        </a-popconfirm>

        <a-popconfirm title="Скрыть/показать?" ok-text="Да" cancel-text="Нет" @confirm="hidePlace(place._id)">
          <MdiIcon v-if="!place.isHidden" name="eye-outline" />
          <MdiIcon v-else name="eye-off-outline" />
        </a-popconfirm>
        <a-popconfirm title="Редактировать?" ok-text="Да" cancel-text="Нет"
          @confirm="router.push(`/edit-place?_id=${place._id}`)">
          <MdiIcon name="pen" />
        </a-popconfirm>
        <MdiIcon @click="show=!show" name="information-outline" />
      </div>
      <div :style="{ color }" style="font-size:14px">
        {{ status }}
      </div>

    </div>
      <a-modal v-model:open="show" :footer="null">
        <PlaceCard :place="place" :inCard = true />
      </a-modal>
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