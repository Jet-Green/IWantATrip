<script setup>
import { ref, onMounted } from 'vue'
import { useGuide } from '../../stores/guide';
import { name } from 'dayjs/locale/ru';

let guideStore = useGuide()

let addGuideModal = ref(false)
let guide = ref({})

let guides = ref([
    {
        name: 'Иван',
        surname: 'Иванов',
        email: 'iv@ya.ru',
        phone: '+7 999 999 99 99',
        image: 'https://xsgames.co/randomusers/assets/avatars/pixel/9.jpg',
        socialMedia: 'https://vk.com/qbitclub',
        offer: 'Профессиональный гид в Татарстане',
        description: 'Описание гида абиммаве абиммаве бимаве абиммаве бибиммаве сибиммаве'
    }
])


onMounted(() => {
    // guides.value = guideStore.guides
})

</script>
<template>
    <a-col :span="24" class="d-flex space-between">
        <h2>Гиды</h2>
        <a-button @click="addGuideModal = true" type="primary" class="lets_go_btn mt-8">
            <span class="mdi mdi-taxi mr-4"></span> Добавить
        </a-button>
        
    </a-col>

    <a-row>
        <a-col v-for="guide in guides" :span="24">
                <a-card style="padding:10px 10px; border-radius: 10px;">
                    <a-card-meta :title="guide.name+' '+guide.surname" :description="guide.offer">
                    <template #avatar>
                        <a-avatar :src="guide.image" />
                    </template>
                    </a-card-meta>
                    <div class="mt-4">
                        <b>О себе:</b> {{ guide.description }}<br>
                        <b>Контакты:</b> {{ guide.phone }}<br>
                        {{ guide.email }}<br>
                        {{ guide.socialMedia }}
                    </div>
                </a-card>
        </a-col>
    </a-row>
</template>
<style>
</style>