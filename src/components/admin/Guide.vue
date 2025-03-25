<script setup>
import { ref, onMounted } from 'vue'
import { useGuide } from '../../stores/guide';
import { refresh } from 'less';

let guideStore = useGuide()

let addGuideModal = ref(false)
let guide = reactive({
    name: '',
    surname: '',
    email: '',
    phone: '',
    image: '',
    socialMedia: '',
    offer: '',
    description: ''
})

let guides = reactive([
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

async function addGuide() {
    if (guide.name.length > 1 && guide.surname.length > 1 && guide.phone.length > 2 && guide.email.length > 2 && guide.offer.length > 2) {
        let location = {}
        if (localStorage.getItem("location")) {
            location = JSON.parse(localStorage.getItem("location"))
            taxi.value.location = location
        }
        let res = await guideStore.addGuide(guide.value)
        addGuideModal.value = false;
        guide.value = {}
        if (res.status == 200) {
            refreshGuides()
        }
    }
}

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
    <a-modal v-model:open="addGuideModal" :footer="null" title="Добавить такси">
            <a-row :gutter="[4, 24]">
                <a-col :span="24" :md="12">
                    Имя
                    <a-input style="width: 100%" v-model:value="guide.name" placeholder="Иван" />
                </a-col>
                <a-col :span="24" :md="12">
                    Фамилия
                    <a-input style="width: 100%" v-model:value="guide.surname" placeholder="Иванов" />
                </a-col>
                <a-col :span="24" :md="12">
                    Почта
                    <a-input style="width: 100%" v-model:value="guide.email" placeholder="ivanov@ya.ru" />
                </a-col>
                <a-col :span="24" :md="12">
                    Телефон
                    <a-input style="width: 100%" v-model:value="guide.phone" placeholder="79127528874" />
                </a-col>
                <a-col :span="24">
                    Краткое описание
                    <a-input style="width: 100%" v-model:value="guide.offer" placeholder="Профессиональный гид" />
                </a-col>
                <a-col :span="24">
                    Социальные сети
                    <a-input style="width: 100%" v-model:value="guide.socialMedia" placeholder="https://vk.com/qbitclub"/>
                </a-col>
                <a-col :span="24">
                    Описание
                    <a-textarea style="width: 100%" v-model:value="guide.description" placeholder="Описание" auto-size/>
                </a-col>
                <a-col :span="24">
                    <a-button type="primary" @click="addGuide()"> добавить </a-button>
                </a-col>
            </a-row>
        </a-modal> 
</template>
<style>
</style>