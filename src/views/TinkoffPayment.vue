<script setup>

import { useRoute } from 'vue-router'

const route = useRoute()

</script>
<template>

    <div style="height: 100dvh;">
        <iframe :src="route.query.url" frameborder="0" width="100%" height="100%"></iframe>
    </div>
</template>