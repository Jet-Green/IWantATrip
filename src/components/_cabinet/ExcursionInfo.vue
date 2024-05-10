<script setup>
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from 'vue-router';
import { useExcursion } from '../../stores/excursion';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport'
dayjs.extend(objectSupport);

const excursionStore = useExcursion()
const route = useRoute()
const router = useRouter()
const _id = route.query._id

let excursion = ref({})
let activeKey = ref([])
let activeKey2 = ref([])
let updateExcursion = async (_id) => {
    const response = await excursionStore.getExcursionById(_id)
    excursion.value = response.data
}

function getDate(dateObj) {
    const dayjsDate = dayjs({ years: dateObj.year, months: dateObj.month, date: dateObj.day })
    if (!dayjsDate.$d) return ''
    let russianDate = (new Date(dayjsDate.$d)).toLocaleDateString('ru-RU', {
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    }).replaceAll(',', '').split(' ')

    return `${russianDate[1]} ${russianDate[2]} ${dateObj.year}`
}

onMounted(async () => {
    updateExcursion(_id)

})
</script>

<template>


    <a-breadcrumb style="cursor: pointer;">
        <a-breadcrumb-item @click="router.push('/cabinet/excursions')">
            К экскурсиям
        </a-breadcrumb-item>
        <a-breadcrumb-item>даты, время, покупатели</a-breadcrumb-item>
    </a-breadcrumb>
    <h3 class="mt-8 mb-8">Информация о "{{ excursion.name }}"</h3>
    <v-container>
        <v-row>
            <v-col :span="24">
                <a-collapse v-model:activeKey="activeKey" class="mt-32 mb-32">
                    <a-collapse-panel :header="`${getDate(d.date)}`" v-for="d, i in excursion.dates" :key="i">
                    

                            <a-collapse v-model:activeKey="activeKey2">
                                <a-collapse-panel :header="`${t.hours}:${t.minutes}`" v-for="t, j in d.times" :key="j">
                                    {{ t }}
                                </a-collapse-panel>

                            </a-collapse>
                      
                    </a-collapse-panel>

                </a-collapse>
            </v-col>

        </v-row>
    </v-container>

</template>
<style lang="scss" scopes>
.ant-collapse-header {
    font-weight: bold;
}
</style>