<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useGuide } from '../../../stores/guide';
import { useRouter } from "vue-router";

let guideStore = useGuide()
const router = useRouter();

let query = reactive({
    search: "",
    isModerated: true,
    isRejected: false,
    isHidden: { $exists: true }
})

let showMoreButton = ref(true)
let page = 1

let moreGuides = async () => {
  page++
  let res = await guideStore.getGuides(page, query)



}
let refreshGuides = async () => {
  page = 1

  await guideStore.getGuides(page, query)

}


const deleteGuide = async (_id) => {
    await guideStore.deleteGuideById(_id)
    await refreshGuides()
};

const hideGuide = async (_id,isHidden) => {
    await guideStore.hideGuide(_id,isHidden)
    await refreshGuides()
}


onMounted(async () => {
  await refreshGuides()

})

</script>

<template>
    <a-col :span="24" class="d-flex space-between align-center mb-16 mt-16">

        <div>
            <a-input-search v-model:value="query.search" placeholder="поиск по имени, email..." allow-clear
                enter-button @search="refreshGuides" style="width: 250px" />
        </div>
    </a-col>

    <a-row :gutter="[16, 16]">
        <a-col v-for="g in guideStore.guides" :key="g._id" :xs="24" :sm="12" :lg="8" class="mb-8">
            <a-card hoverable style="padding: 10px; height: 100%;">


                <div class="" style="width: 100%;">
                    <a-avatar :size="40" :src="g.image" />

                    <span style="font-weight: 700; margin: 4px;">{{ g.name + ' ' + g.surname }}</span>
                </div>



                <div class="mt-8 ">
                    <div v-if="g.location"><b>Локации:</b> {{ g.location.name }}</div>
                    <div v-if="g.phone"><b>Тел:</b> {{ g.phone }}</div>
                    <div v-if="g.email"><b>Email:</b> {{ g.email }}</div>
                    <div v-if="g.socialMedia"><b>Соц.сеть:</b> <a :href="g.socialMedia" target="_blank"
                            rel="noopener noreferrer">{{ g.socialMedia }}</a></div>
                </div>
                <a-divider class="ma-4" style="border-color: #205f79"></a-divider>
                <div class="actions d-flex justify-center">
                    <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="deleteGuide(g._id)">
                        <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
                    </a-popconfirm>
                    <a-popconfirm title="Скрыть/показать?" ok-text="Да" cancel-text="Нет"
                        @confirm="hideGuide(g._id,g.isHidden)">
                        <span v-if="!g.isHidden" class="mdi mdi-eye-outline"></span>
                        <span v-else class="mdi mdi-eye-off-outline"></span>
                    </a-popconfirm>

                    <span class="mdi mdi-pencil" @click="router.push(`/edit-guide?_id=${g._id}&is_admin=${true}`)"
                        style="color: #245159; cursor: pointer"></span>
                </div>
            </a-card>
        </a-col>
        <a-col v-if="guideStore.guides?.length === 0 && !showMoreButton" :span="24">
            <a-empty description="Гиды не найдены" />
        </a-col>
    </a-row>

    <a-row v-if="showMoreButton" justify="center" class="mt-16 mb-16">
        <a-col>
            <a-button @click="moreGuides()">
                Загрузить ещё
            </a-button>
        </a-col>
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