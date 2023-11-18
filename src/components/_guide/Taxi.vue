<script setup>
import { onMounted, ref } from 'vue'
import { useGuide } from '../../stores/guide';
import BackButton from "../BackButton.vue";

let localTaxi = ref({})

let guideStore = useGuide()

let rafreshTaxi = async () => {
    let location = {}
    if (localStorage.getItem("location")) {
        location = JSON.parse(localStorage.getItem("location"))
    }
    let res = await guideStore.getLocalTaxi(location)
    localTaxi.value = res.data[0].taxi
}
onMounted(async () => {
    rafreshTaxi()
})
</script>
<template>
    <div>
        <BackButton />

        <a-row type="flex" justify="center">
            <a-col :xs="22" :lg="16">
                <h2>Такси</h2>
                <a-row :gutter="[8, 8]" type="flex" justify="center">
                    <a-col v-for="(t, i) in localTaxi" :xs="24" :md="12" :xl="8">
                        <a :href="`tel:${t.phone}`">
                            <a-card hoverable style="padding:10px 10px; border-radius: 10px; position: relative;"
                                :class='i % 2 == 0 ? "orange" : "blue"'>
                                <div style="font-size:24px"><b>{{ t.name }}</b></div>
                                <div style="font-size:18px"><span class="mdi mdi-phone-in-talk number"></span> {{ t.phone }}
                                </div>
                                <span class="mdi mdi-taxi taxi" style="position: absolute; bottom: 5px; right: 5px;"></span>
                            </a-card>
                        </a>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>
<style>
.taxi {
    font-size: clamp(1rem, 2rem, 3rem);
}

.orange {
    background-color: #FF6600;
    color: white;
}

.blue {
    background-color: #64BED8;
    color: white;
}


.number {
    font-size: 16px;
    color: white;
    font-size: large;
}
</style>