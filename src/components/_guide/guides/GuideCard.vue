<script setup>
import { useRouter } from 'vue-router';
let props = defineProps({
    'guide': Object,
    'withButton': Boolean
}
);
let guide = props?.guide
let withButton = props.withButton
const router = useRouter()
</script>
<template>
    <div class="guide-card">
        <a-row class="text">

            <a-col :xs="24">
                <div
                    style=" font-size: clamp(1.125rem, 0.925rem + 0.8vw, 1.375rem); font-weight: 700; text-align: center;">
                    {{
                        `${guide?.name} ${guide?.surname}` }}</div>
            </a-col>
            <a-col :xs="24" style="text-align: center; margin-bottom: 10px;">
                {{ guide?.offer }}
            </a-col>
            <a-col :xs="24" :md="8"> <img :src="guide?.image" class="pa-8" alt="Guide Image" style="width: 90%; text-align: center;" />
            </a-col>
            <a-col :xs="24" :md="16" class="d-flex align-center">
                <div style="width: 100%;">
                    <div> Локация: <b> {{ guide?.location?.name }}</b></div>
                    <div v-if="guide?.phone"> Телефон: <b>{{ guide?.phone }}</b></div>
                    <div v-if="guide?.socialMedia"> Соц. сеть: <b> {{ guide?.socialMedia }}</b></div>
                    <div v-if="guide?.email"> Почта: <b>{{ guide?.email }}</b></div>
                     <div v-if="guide?.type"> Статус: <b>{{ guide?.type }}</b></div>
                    <div class="d-flex justify-center" >
                        <a-button class="lets_go_btn ma-36" type="primary"
                            @click="router.push(`/guide?_id=${guide._id}`)" v-if="withButton">Подробнее</a-button>
                    </div>
                </div>

            </a-col>
            <!-- 
            <a-col :xs="24">
                <p>{{ guide.description }}</p>
            </a-col>
            <a-col :xs="24">
                <p> {{ guide.excursionsIn }}</p>
            </a-col> -->

        </a-row>







    </div>


</template>
<style scoped></style>