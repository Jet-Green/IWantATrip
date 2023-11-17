<script setup>
import { onMounted } from 'vue'
import { useAppState } from '../../stores/appState';
import BackButton from "../BackButton.vue";

let appStateStore = useAppState()

onMounted(async () => {
    if (!appStateStore.appState) {
        await appStateStore.refreshState();
    }
})
</script>
<template>
    <div>
        <BackButton />

        <a-row type="flex" justify="center">
            <a-col :xs="22" :lg="16">
                <h2>Такси</h2>
                <a-row :gutter="[16, 16]" class="mt-3" type="flex" justify="center">
                    <a-col v-for="(t, i) in appStateStore.appState[0].taxi" :xs="24" :md="12" :lg="8">
                        <a-card hoverable style="padding:20px 30px; border-radius: 5px;"
                            :class='i % 2 == 0 ? "orange" : "blue"'>
                            <a-row>
                                <a-col :span="20">
                                    <b>{{ t.name }}</b> <br />
                                    <a href="tel:" class="number">
                                        <span class="mdi mdi-phone-in-talk"></span> {{ t.number }}
                                    </a>
                                </a-col>
                                <a-col><span class="mdi mdi-taxi taxi"></span></a-col>
                            </a-row>
                        </a-card>
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
    background-color: #FF6600 !important;
    color: white;
}

.blue {
    background-color: #64BED8 !important;
    color: white;
}

b {
    font-size: 23px;
}

.number {
    font-size: 16px;
    color: white !important;
    font-size: large;
}
</style>