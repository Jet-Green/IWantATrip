<script setup>
import { QuillEditor } from '@vueup/vue-quill';
import { useRouter } from "vue-router";
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

const router = useRouter();
const quill = ref(null);

function clearForm() {
    Object.assign(form, {
    topic: '',
    offer: '',
    date: '',
    tripRoute: '',
    maxPeople: '',
    description: '',
    })
}

async function submit() {
    await useIdea().createIdea(form.value)
    router.push("/");
    clearForm()
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
                            <a-input v-model:value="form.topic" placeholder="Кездурские водопады" :maxlength="50" show-count></a-input>
                        </a-col>
                        
                        <a-col :span="24" class="mt-8">
                            Краткое описание
                            <a-textarea autoSize v-model:value="form.offer" placeholder="Родник недалеко от д.Кездур. С десяток струй вырываются из чаши обрыва и образуют ручей, скатывающийся в пойму р.Лып"></a-textarea>
                        </a-col>
                        <a-col :span="24" class="mt-8">
                            Примерная дата
                            <a-input v-model:value="form.date" placeholder="С 10 по 20 июля"></a-input>
                        </a-col>
                        <a-col :span="24" :lg="12" class="mt-8">
                            Маршрут
                            <a-input v-model:value="form.tripRoute" placeholder="Глазов-Кез-Кездурские водопады-Глазов"></a-input>
                        </a-col>
                        <a-col :span="24" :lg="12" class="mt-8">
                            Количество людей
                            <a-input v-model:value="form.maxPeople" placeholder="Не больше 12 человек"></a-input>
                        </a-col>                        
                        <a-col :span="24" class="mt-8">
                            Описание
                            <a-textarea autoSize v-model:value="form.description" placeholder="1. Посетим один из самых красивых ключей Удмуртии.
2. Узнаем историю обнаружения и использования водопадов
3. Организуем пикник в зоне отдыха
                            "></a-textarea>
                        </a-col>
                        <a-col :span="24" class="d-flex justify-center">
                        <a-button @click="submit" class="lets_go_btn ma-8" type="primary">Отправить</a-button>
                        </a-col>

                </a-row>                
            </a-col>
        </a-row>
    </div>
</template>