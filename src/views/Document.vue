<script setup>
import BackButton from "../components/BackButton.vue";
import VuePdfEmbed from 'vue-pdf-embed'
import { onMounted, ref } from "vue"

import { useAppState } from '../stores/appState'

const appStateStore = useAppState()
let pdfSource = ref('')

onMounted(() => {
    pdfSource.value = appStateStore.docLink
})

</script>
<template>
    <div style="margin-top: 69px">
        <BackButton />
        <a-row class="justify-center d-flex d-column">
            <a-col :xs="22" :xl="16" class="mb-32">
                <div style="text-align: center;">
                    <a download :href="pdfSource"> <a-button>Скачать</a-button></a>

                </div>
                <VuePdfEmbed style="width: 100%;" :source="pdfSource" />
            </a-col>
        </a-row>
    </div>
</template>
<style scoped></style>