<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useGuide } from '../../../stores/guide';
import { useRouter } from "vue-router";
import { message } from 'ant-design-vue';

let guideStore = useGuide()
const router = useRouter();

let dbSkip = ref(0)
let limit = ref(true) // Initialize limit correctly
let query = ref({ strQuery: "" })

let guides = ref([])


async function refreshGuides() {
    dbSkip.value = 0;
    guides.value = [];
    limit.value = true;
    await loadMoreGuides();
}

async function loadMoreGuides() {
    if (!limit.value) return; // Stop if server indicated no more data

    try {
        let res = await guideStore.getGuides(query.value, dbSkip.value)
        if (res.data && res.data.data) {
            dbSkip.value = res.data.dbSkip
            guides.value.push(...res.data.data)
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


const deleteGuide = async (_id) => {
    await guideStore.deleteGuideById(_id)
    await refreshGuides()
};

const hideGuide = async (_id) => {
    await guideStore.hideGuide(_id)
    await refreshGuides()
}


onMounted(async () => {
    await loadMoreGuides();
})

</script>

<template>
    <a-col :span="24" class="d-flex space-between align-center mb-16 mt-16">

        <div>
            <a-input-search v-model:value="query.strQuery" placeholder="поиск по имени, email..." allow-clear
                enter-button @search="refreshGuides" style="width: 250px" />
        </div>
    </a-col>

    <a-row :gutter="[16, 16]">
        <a-col v-for="g in guides" :key="g._id" :xs="24" :sm="12" :lg="8" class="mb-8">
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
                        @confirm="hideGuide(g._id)">
                        <span v-if="!g.isHidden" class="mdi mdi-eye-outline"></span>
                        <span v-else class="mdi mdi-eye-off-outline"></span>
                    </a-popconfirm>

                    <span class="mdi mdi-pencil" @click="router.push(`/edit-place?_id=${place._id}&is_admin=${true}`)"
                        style="color: #245159; cursor: pointer"></span>
                </div>
            </a-card>
        </a-col>
        <a-col v-if="guides.length === 0 && !limit" :span="24">
            <a-empty description="Гиды не найдены" />
        </a-col>
    </a-row>

    <a-row v-if="limit" justify="center" class="mt-16 mb-16">
        <a-col>
            <a-button @click="loadMoreGuides()">
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