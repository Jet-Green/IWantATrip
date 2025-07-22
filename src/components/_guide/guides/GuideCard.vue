<script setup>
import { useRouter } from 'vue-router';
let props = defineProps({
    'guide': Object,
    'withButton': Boolean
}
);
let guide= props?.guide
let withButton= props.withButton
const router = useRouter()
</script>
<template>
    <div class="guide-card">
        <a-row>

            <a-col :xs="24">
                <p style=" font-size: clamp(1.125rem, 0.925rem + 0.8vw, 1.375rem); margin-bottom: 0;"> {{
                    `${guide?.name} ${guide?.surname}` }}</p>
            </a-col>
            <a-col :xs="24">
                {{ guide?.offer }}
            </a-col>
            <a-col :xs="24" :md="8"> <img :src="guide?.image" class="pa-8" alt="Guide Image" style="width: 100%;" />
            </a-col>
            <a-col :xs="24" :md="16">

                <p> Локация: <b> {{ guide?.location?.name }}</b></p>
                <p> Телефон: <b>{{ guide?.phone }}</b></p>
                <p> Соц. сеть: <b> {{ guide?.socialMedia }}</b></p>
                <p> Почта: <b>{{ guide?.email }}</b></p>
                <div class="d-flex justify-center">
                    <a-button class="lets_go_btn ma-36" type="primary" @click="router.push(`/guide?_id=${guide._id}`)" v-if="withButton">Подробнее</a-button>
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