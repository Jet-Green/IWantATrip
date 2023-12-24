<script setup>
import { onMounted } from "vue";
import BackButton from "../BackButton.vue";

import { useAppState } from '../../stores/appState';

let appStateStore = useAppState()


let mountWidget = () => {
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://gettransfer.com/transfers/widget.js?widget_id=232')
    document.head.appendChild(recaptchaScript)
    appStateStore.widgetIsMount = false
}

onMounted(() => {
    if (appStateStore.widgetIsMount) {
        mountWidget()
    } else {
            document.getElementById("gettransfer_widget").appendChild(gtIframe),
            window.addEventListener ? window.addEventListener("message", frameListener) : window.attachEvent("onmessage", frameListener);
    }
})


</script>
<template>
    <div>
        <BackButton />
        <a-row type="flex" justify="center">
            <a-col :xs="22" :lg="16">
                <h2>
                    Заказать транспорт
                </h2>
            </a-col>
        </a-row>
        <div id="gettransfer_widget" class="mt-16">

        </div>

    </div>
</template>
