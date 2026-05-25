<script setup>
import { onMounted, ref,reactive } from "vue"
import { useGuide } from "../../../stores/guide"
import { useRouter } from "vue-router"

const guideStore = useGuide()
let router = useRouter()
let query = reactive({
    search: "",
    isModerated: false,
    isRejected: false,
    isHidden:false
})

let showMoreButton = ref(true)

let page = 1

// let moreGuides = async () => {
//   page++
//   let res = await guideStore.getGuides(page, query)

//   if (res.length == postersLength) {
//     showMoreButton.value = false
//   }
//   postersLength = res.length
// }

let refreshGuides = async () => {
  page = 1

  await guideStore.getGuides(page, query)

}

onMounted(async () => {
  await refreshGuides()

})
</script>
<template>
  <a-row :gutter="[8, 8]" class="mt-8">
    <a-col
      :lg="8"
      :sm="12"
      :xs="24"
      v-if="guideStore.guides.length > 0"
      v-for="(guide, index) of guideStore.guides"
      :key="index"
    >
    <a-card hoverable style="border-radius: 10px;" class="pa-4">
                <a-card-meta>
                    <template #title>
                    <div class="d-flex" style="flex-wrap: wrap;">
                            
                            <div class="d-flex space-between" style="width: 100%;">
                            <a-avatar :size="40" :src="guide.image"/>
                          </div>
                          <span>{{ guide.name + ' ' + guide.surname }}</span>
                        </div>
                      </template>
                      <!-- <template #avatar>
                        <a-avatar :size="40" :src="guide.image" class="mr-8" style=""/>
                      </template> -->
                    </a-card-meta>
                    <div class="mt-8 card-content">
                      <!-- <p><b>О себе:</b> {{ guide.description }}</p> -->
                      <div class="text-truncate"> {{ guide.offer }}</div>
                      <p v-if="guide.location"><b>Локации:</b> {{ guide.location }}</p>
                      <!-- <p v-if="guide.phone"><b>Тел:</b> {{ guide.phone }}</p>
                      <p v-if="guide.email"><b>Email:</b> {{ guide.email }}</p>
                      <p v-if="guide.socialMedia"><b>Соц.сеть:</b> <a :href="guide.socialMedia" target="_blank" rel="noopener noreferrer">ссылка</a></p> -->
                    </div>
                    <div class="d-flex justify-center">
                    <a-button type="primary" style="border-radius: 18px; text-align: center;" class="mt-4" @click="router.push('/guide-moderation/?_id=' + guide._id)" >
                            <template #icon>
                                <MdiIcon name="check-decagram-outline" />
                            </template>
                            проверить
                      </a-button>
                    </div>
            </a-card>
    </a-col>
    <a-col :span="24" v-else> Нет гидов на модерации </a-col>
  </a-row>
</template>
<style scoped lang="scss">
.actions {
  font-size: 20px;
  position: relative;

  * {
    margin: 4px;
    cursor: pointer;
  }
}
</style>
