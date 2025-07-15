<script setup>
let props = defineProps(['guide']);
</script>
<template>
    <div class="guide-card">
        <a-row>

            <a-col :xs="24">
                <p style=" font-size: clamp(1.125rem, 0.925rem + 0.8vw, 1.375rem);"> {{
                    `${guide.name} ${guide.surname}` }}</p>
                <h2></h2>
            </a-col>
            <a-col :xs="24">
                {{ guide.offer }}
            </a-col>
            <a-col :xs="24" :md="8"> <img :src="guide.image" class="pa-8" alt="Guide Image" style="width: 100%; border-radius: 50%;" />
            </a-col>
            <a-col :xs="24" :md="16">

                <p>{{ guide.location }}</p>
                <p>{{ guide.phone }}</p>
                <p>{{ guide.socialMedia }}</p>
                <p>{{ guide.email }}</p>
            </a-col>

            <a-col :xs="24">
                <p>{{ guide.description }}</p>
            </a-col>
            <a-col :xs="24">
                <p> {{ guide.excursionsIn }}</p>
            </a-col>

        </a-row>







    </div>


</template>
<style scoped></style>