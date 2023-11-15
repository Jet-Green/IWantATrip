<script setup>
import { ref, watch } from 'vue'

import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

import { useBooking } from '../../../stores/booking.js'

import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import BackButton from '../../BackButton.vue';

const route = useRoute()
const router = useRouter()

const bookingStore = useBooking()

const quill = ref(null);

let offerText = ref('')

async function sendOffer() {
    let res = await bookingStore.offerTrip({ offerText: offerText.value, date: Date.now() }, route.query.booking_id)
    if (res.status == 200) {
        router.push('/cabinet/booking-notifications')
    }
}

watch(offerText, (newValue) => {
    let newContent = newValue;

    if (newContent === newValue) return;
    quill.value.setHTML(newValue);
    // Workaround https://github.com/vueup/vue-quill/issues/52
    // move cursor to end
    nextTick(() => {
        let q = quill.value.getQuill();
        q.setSelection(newValue.length, 0, "api");
        q.focus();
    });
});
</script>
<template>
    <div>
        <BackButton />
        <a-row type="flex" justify="center">
            <a-col :xs="22" :lg="16">
                <h3>Предложить тур</h3>
            </a-col>
            <a-col :xs="22" :lg="16" style="display: flex; flex-direction: column">
                <QuillEditor theme="snow" ref="quill" v-model:content="offerText" contentType="html" :toolbar="[
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ color: ['#000000', '#ff6600', '#3daff5'] }],
                    [{ align: [] }],
                ]
                    " />
            </a-col>
            <a-col :xs="22" :lg="16" class="d-flex justify-center mt-16">
                <a-button @click="sendOffer" type="primary" size="large">отправить</a-button>
            </a-col>
        </a-row>
    </div>
</template>