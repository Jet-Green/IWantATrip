<script setup>
import { useRouter } from 'vue-router';
let props = defineProps({
    'guide': Object,
    'withButton': Boolean
}
);
let guide = props?.guide
let withButton = props.withButton
const router = useRouter()
</script>
<template>
    <div class="guide-card">
        <div class="guide-content">
            <div class="avatar-container">
                <img :src="guide?.image" class="avatar" alt="Guide Image" />
            </div>

            <div class="name">
                {{ `${guide?.name} ${guide?.surname}` }}
            </div>

            <div class="offer" v-if="guide?.offer">
                {{ guide?.offer }}
            </div>

            <a-button class="more-btn" @click="router.push(`/guide?_id=${guide._id}`)"
                v-if="withButton">Подробнее</a-button>
        </div>
    </div>
</template>
<style scoped>
.guide-card {
    border-radius: 16px;
    padding: 20px;
    background: white;
    height: 100%;
}

.guide-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: 100%;
    justify-content: space-between;
}

.avatar-container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
}

.avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
}

.name {
    font-size: clamp(1.125rem, 0.925rem + 0.8vw, 1.375rem);
    font-weight: 700;
    margin-bottom: 8px;
}

.offer {
    margin-bottom: 16px;
    color: #666;
}

.more-btn {
    background-color: #FF6600;
    border-color: #FF6600;
    color: white;
    border-radius: 20px;
    padding: 4px 24px;
}

.more-btn:hover {
    background-color: #e65c00;
    border-color: #e65c00;
    color: white;
}
</style>