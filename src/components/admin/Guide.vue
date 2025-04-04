<script setup>
import { ref, onMounted } from 'vue'
import { useGuide } from '../../stores/guide';
import { refresh } from 'less';

let guideStore = useGuide()

let dbSkip=ref(0)
let limit = ref(0)
let addGuideModal = ref(false)
let query = ref("")
let guide = ref({
    name: '',
    surname: '',
    email: '',
    phone: '',
    image: '',
    socialMedia: '',
    offer: '',
    description: ''
})
// {
//         name: 'Иван',
//         surname: 'Иванов',
//         email: 'iv@ya.ru',
//         phone: '+7 999 999 99 99',
//         image: 'https://xsgames.co/randomusers/assets/avatars/pixel/9.jpg',
//         socialMedia: 'https://vk.com/qbitclub',
//         offer: 'Профессиональный гид в Татарстане',
//         description: 'Описание гида абиммаве абиммаве бимаве абиммаве бибиммаве сибиммаве',
//         location: ''
//     }
let guides = ref([])

async function refreshGuides() {
    // console.log(query.value dbSkip.value)
    while (limit.value<=2){
        let res = await guideStore.getGuides(query.value,dbSkip.value)
        if (res.ended){break;}
        // console.log(res)
        dbSkip.value=res.dbSkip
        guides.value.push(...res.data.data)
        console.log(res.data.data.length)
        limit.value = limit.value + res.data.data.length
    limit.value=0
    // console.log(guides,res.data)
    // guides.value=res.data
    }
}

async function addGuide() {
    if (guide.value.name.length > 1 && guide.value.surname.length > 1 && guide.value.phone.length > 2 && guide.value.email.length > 2 && guide.value.offer.length > 2 
        && guide.value.description.length > 2 && guide.value.name.search(new RegExp(/@*./)) != -1
    ) {
        let res = await guideStore.addGuide(guide.value)
        addGuideModal.value = false;
        guide.value = {
            name: '',
            surname: '',
            email: '',
            phone: '',
            image: '',
            socialMedia: '',
            offer: '',
            description: '',
            location: ''
        }
        if (res.status === 200) {
            await refreshGuides()
        }
    }
}

onMounted(async () => {
    await refreshGuides()
})

</script>
<template>
    <a-col :span="24" class="d-flex space-between">
    <div class="d-flex">
        <h2>Гиды</h2>
        <a-col :span="24" class="ml-8 mt-4">
            <a-button type="primary" @click="addGuideModal = true;" style="border-radius: 18px"> добавить </a-button>
        </a-col>
    </div>
    <div>
        <a-input-search v-model:value="query" placeholder="поиск" allow-clear enter-button @search="refreshGuides()"/>
    </div>
    </a-col>

    <a-row>
        <a-col v-for="guide in guides" :span="24" class="mb-8">
                <a-card style="padding:10px 10px; border-radius: 10px;">
                    <a-card-meta :title="guide.name+' '+guide.surname" :description="guide.offer">
                    <template #avatar>
                        <a-avatar :src="guide.image" />
                    </template>
                </a-card-meta>
                <div class="mt-4">
                    <b>О себе:</b> {{ guide.description }}<br>
                    <b>Локации:</b> {{ guide.location }}<br>
                    <!-- <b>О себе:</b> {{ guide.description }}<br> -->
                    <!-- <b>Контакты:</b> {{ guide.phone }}<br> -->
                    <!-- {{ guide.email }}<br> -->
                    <!-- {{ guide.socialMedia }} -->
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
                    Локации
                    <a-input style="width: 100%" v-model:value="guide.location" placeholder="Москва Новгород Верхняя Слудка"/>
                </a-col>
                <a-col :span="24">
                    Описание
                    <a-textarea style="width: 100%" v-model:value="guide.description" placeholder="Описание" auto-size/>
                </a-col>
                <a-button type="primary" @click="addGuide()" style="border-radius: 18px"> добавить </a-button>
            </a-row>
        </a-modal> 
</template>
<style>
</style>