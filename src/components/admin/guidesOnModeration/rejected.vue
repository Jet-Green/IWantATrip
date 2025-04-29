<script setup>
import { onMounted, ref } from "vue"
import { useGuide } from "../../../stores/guide"
import { useRouter } from "vue-router"

const guideStore = useGuide()
let guidesRejected = ref([])
let router = useRouter()

let dbSkip = ref(0)
let limit = ref(true) // Initialize limit correctly
let query = ref({strQuery: "", isModerated:false, isRejected:true})

async function deleteGuide(_id) {

  await guideStore.deleteGuideById(_id)
  await refreshGuidesOnModeration()
}

async function refreshGuidesOnModeration() {
    // Reset state for potentially new search/load
    dbSkip.value = 0;
    guidesRejected.value = [];
    limit.value = true; // Allow fetching again
    await loadMoreGuides(); // Load initial batch
}
async function loadMoreGuides() {
    if (!limit.value) return; // Stop if server indicated no more data

    try {
        let res = await guideStore.getGuides(query.value, dbSkip.value)
        if (res.data && res.data.data) {
            dbSkip.value = res.data.dbSkip
            guidesRejected.value.push(...res.data.data)
            if (res.data.ended) {
                limit.value = false // No more data to load
            }
        } else {
            limit.value = false; // Assume end if data is unexpected
        }
    } catch (error) {
        console.error("Error fetching guides:", error);
        message.error("Не удалось загрузить гидов.");
        limit.value = false; // Stop trying on error
    }
}

onMounted(async () => {
  await refreshGuidesOnModeration()
})
</script>
<template>

  <a-row :gutter="[8, 8]" class="mt-8">
    <a-col
      :lg="8"
      :sm="12"
      :xs="24"
      v-if="guidesRejected.length > 0"
      v-for="(guide, index) of guidesRejected"
      :key="index"
    >
    <a-card hoverable style="border-radius: 10px;" class="pa-4">
                <a-card-meta>
                    <template #title>
                    <div class="d-flex" style="flex-wrap: wrap;">
                            
                            <div class="d-flex space-between" style="width: 100%;">
                            <a-avatar :size="40" :src="guide.image"/>

                            <a-popconfirm title="Удалить гида?" ok-text="Да" cancel-text="Нет"
                                @confirm="deleteGuide(guide._id)">
                                <a-button type="primary" style="border-radius: 18px" class="mt-4">
                                    <template #icon>
                                        <span class="mdi mdi-delete"></span>
                                    </template>
                                </a-button>
                            </a-popconfirm>
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
            </a-card>
    </a-col>
    <a-col :span="24" v-else> Нет гидов для модерации </a-col>
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
