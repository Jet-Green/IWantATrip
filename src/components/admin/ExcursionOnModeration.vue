<script setup>
import { onMounted, ref } from 'vue';
import {useRouter} from "vue-router"

import { useExcursion } from '../../stores/excursion';

const excursionStore = useExcursion()
const router = useRouter()

let excursions = ref([])


async function updateExcursion() {
    let response = await excursionStore.getExcursionsOnModeration()
    excursions.value = response.data
}

function look (_id) {
    router.push(`/excursion-moderation?_id=${_id}`)
}
async function deleteExcursion(_id) {
    // поставить защиту на удаление проданных экскурсий
    let res = await excursionStore.deleteExcursion(_id)
    await updateExcursion()
}




onMounted(async () => {
    await updateExcursion()

})
</script>
<template>
    <a-row>
        <a-col :span="24">
            <h3>Экскурсии на модерации</h3>

            <a-row :gutter="[8, 8]" class="mt-8">
                <a-col :lg="8" :sm="12" :xs="24" v-if="excursions.length" v-for="(excursion, index) of excursions"
                    :key="index">
                    <a-card class="card" hoverable>
                        <div style="text-align:center">
                            {{ excursion.name }}
                        </div>
                        <a-divider class="ma-4" style="border-color: #205F79"></a-divider>


                        <div class="mt-8">Автор: {{ excursion.author?.fullinfo?.fullname }}</div>
                        <div class="mt-8">Телефон: {{ excursion.contacts.phone }}</div>
                        <div class="mt-8">Почта: {{ excursion.contacts.email }}</div>

                        <div class="actions d-flex justify-center">
                            <a-popconfirm title="Проверить?" ok-text="Да" cancel-text="Нет"
                                @confirm="look(excursion._id)">
                                <span class="mdi mdi-check-decagram-outline"></span>
                                
                            </a-popconfirm>

                            <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет"
                                @confirm="deleteExcursion(excursion._id)">
                                <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
                            </a-popconfirm>


                        </div>
                    </a-card>
                </a-col>
                <a-col :span="24" v-else>
                    Нет экскурсий на модерации
                </a-col>
            </a-row>
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