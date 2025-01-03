<script setup>
import { toRefs, computed, ref, onMounted, reactive } from "vue"
import { useRouter } from "vue-router"

let props = defineProps(["partner"])
let emit = defineEmits(["refreshPartners"])
import { usePartners } from "../../../stores/partner"

const router = useRouter()
const partnerStore = usePartners()
let color = ref("black")
let show = ref(false)
// toRefs add reactivity
let { partner } = toRefs(props)

async function partnerToDelete(_id) {
  let response = await partnerStore.deletePlace(_id)
  if (response.status == 200) {
    emit("refreshPartners")
  }
}
async function hidePlace(_id) {
  let response = await partnerStore.hidePlace(_id)
  if (response.status == 200) {
    emit("refreshPartners")
  }
}
</script>
<template>
  <a-card class="card" v-if="partner._id">
    <div style="width: 100%; height: 100%; text-align: center; font-weight: 700">
      {{ partner.name }}
    </div>
    <div v-if="partner?.category" style="text-align: center">
      {{ partner?.category }}
    </div>
    <div v-if="partner?.phone">
      Тел: <a :href="`tel:${partner?.phone}`">{{ partner?.phone }}</a>
    </div>
    <div v-if="partner?.email">
      Почта: <a :href="`mailto:${partner?.email}`"> {{ partner?.email }}</a>
    </div>
    <div v-if="partner?.contactPerson">Контакт: {{ partner?.contactPerson }}</div>
    <div v-if="partner?.location.name">Адрес: {{ partner?.location.name }}</div>

    <a-divider class="ma-4" style="border-color: #205f79"></a-divider>
    <div class="actions">
      <div>
        <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="partnerToDelete(partner._id)">
          <span class="mdi mdi-delete" style="color: #ff6600"></span>
        </a-popconfirm>

        <a-popconfirm
          title="Редактировать?"
          ok-text="Да"
          cancel-text="Нет"
          @confirm="router.push(`/create-partner?_id=${partner._id}`)"
        >
          <span class="mdi mdi-pen"></span>
        </a-popconfirm>
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
</style>
