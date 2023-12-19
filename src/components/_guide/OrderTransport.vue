<script setup>
import BackButton from "../BackButton.vue";
import { onMounted } from "vue";

onMounted(() => {
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://gettransfer.com/transfers/widget.js?widget_id=232')
    document.head.appendChild(recaptchaScript)
})
</script>
<template>
    <div>
        <BackButton />
        <a-row type="flex" justify="center">
            <a-col :xs="22" :lg="16">
                <h2>
                    Закзать транспорт
                </h2>
            </a-col>
        </a-row>
        <a-row class="mt-16" type="flex" justify="center">
            <a-col :xs="22" :lg="16">
                <div id="gettransfer_widget"></div>
            </a-col>
        </a-row>
    </div>
</template>
