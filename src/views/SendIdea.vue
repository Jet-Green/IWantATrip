<script setup>
import { QuillEditor } from '@vueup/vue-quill';
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { ref, watch } from 'vue';
import BackButton from '../components/BackButton.vue';
import { useIdea } from '../stores/idea'

let form = ref({
    topic: '',
    description: ''
})

async function submit() {
    await useIdea().createIdea(form.value)
}
</script>

<template>
    <div>
        <BackButton />        
        <a-row type="flex" justify="center">
            <a-col :xs="22" :lg="12">
                <h2>Предложить идею</h2>

                <a-row class="mt-4">
                    <a-col :span="24" :lg="18">
                        <a-input v-model:value="form.topic" placeholder="Тема" :maxlength="50" show-count></a-input>
                        
                        <div class="mt-8">
                            <a-textarea v-model:value="form.description" placeholder="Описание"></a-textarea>
                        </div>

                        <a-button @click="submit" class="lets_go_btn mt-12" type="primary">Отправить</a-button>
                    </a-col>
                </a-row>                
            </a-col>
        </a-row>
    </div>
</template>