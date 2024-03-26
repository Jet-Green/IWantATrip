<script setup>
import { QuillEditor } from '@vueup/vue-quill';
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { ref, watch } from 'vue';
import BackButton from '../components/BackButton.vue';
import { useIdea } from '../stores/idea'

let form = ref({
    topic: '',
    offer: '',
    date: '',
    tripRoute: '',
    maxPeople: '',
    description: '',
})

const quill = ref(null);

async function submit() {
    // form.value.description=form.value.description.replaceAll('<p>','')
    // form.value.description=form.value.description.replaceAll('<span','')
    // form.value.description=form.value.description.replaceAll('</span>','')
    // form.value.description=form.value.description.replaceAll('</p>','')
    // form.value.description=form.value.description.replaceAll('<br>','')
    await useIdea().createIdea(form.value)
}
</script>

<template>
    <div>
        <BackButton />        
        <a-row type="flex" justify="center">
            <a-col :xs="22" :lg="12">
                <h2>Предложить идею</h2>

                <a-row class="mt-4" :gutter="[16, 16]">
                        <a-col :span="24" class="mt-8">
                            Тема
                            <a-input v-model:value="form.topic" placeholder="Тур в Абхазию" :maxlength="50" show-count></a-input>
                        </a-col>
                        
                        <a-col :span="24" class="mt-8">
                            Краткое описание
                            <a-input v-model:value="form.offer" placeholder="Нужно будет посетить горы и вкусно поесть"></a-input>
                        </a-col>
                        <a-col :span="24" class="mt-8">
                            Примерная дата
                            <a-input v-model:value="form.date" placeholder="С 10 по 20 июля"></a-input>
                        </a-col>
                        <a-col :span="12" class="mt-8">
                            Маршрут
                            <a-input v-model:value="form.tripRoute" placeholder="Глазов-Абхазия-Гора1-Гора2-Глазов"></a-input>
                        </a-col>
                        <a-col :span="12" class="mt-8">
                            Количество людей
                            <a-input v-model:value="form.maxPeople" placeholder="12"></a-input>
                        </a-col>                        
                        <a-col :span="24" class="mt-8">
                            Описание
                            <a-textarea v-model:value="form.description" placeholder="Посещаем Абхазию на 10 дней. Без алкоголя, можно детей от 16 лет. Посетим много гор, попробуем местную кухню..."></a-textarea>
                        </a-col>

                        <a-button @click="submit" class="lets_go_btn mt-12" type="primary">Отправить</a-button>

                </a-row>                
            </a-col>
        </a-row>
    </div>
</template>