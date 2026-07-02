<script setup>
import { onMounted } from "vue";
import BackButton from "../BackButton.vue";

onMounted(() => {
    let resizeScript = document.createElement('script')
    resizeScript.setAttribute('type', 'text/javascript')
    resizeScript.setAttribute('src', 'https://iway.ru/js/plugins/iframe.resize.js')
    document.head.appendChild(resizeScript)
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
        <div class="mt-16">
            <iframe width="100%" height="900" id="iway-frame" name="iway-frame"
                src="https://iway.ru/steporder/framens?userID=170838&lang=ru&currency=RUB&pos=iframe"
                onload="if (typeof FrameResize != 'undefined') FrameResize.registerFrame(this)"
                frameborder="0"></iframe>
        </div>
    </div>
</template>
