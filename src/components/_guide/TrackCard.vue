<script setup>
import { computed } from 'vue'

const props = defineProps({
    track: Object
})

const track = props.track

const formatDuration = (minutes) => {
    if (!minutes) return 'не рассчитано'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
        return `${hours} ч ${mins} мин`
    }
    return `${mins} мин`
}

const placesCount = computed(() => {
    if (Array.isArray(track.places)) {
        return track.places.length
    }
    return 0
})

const previewImage = computed(() => {
    if (Array.isArray(track.places) && track.places.length > 0) {
        const firstPlace = track.places[0]
        if (firstPlace?.images?.length) {
            return firstPlace.images[0]
        }
    }
    return null
})

const placesNames = computed(() => {
    if (Array.isArray(track.places) && track.places.length > 0) {
        return track.places.map(place => place.title || place.name).join(' - ')
    }
    return ''
})
</script>

<template>
    <div class="card">
        <div class="track-preview" :style="previewImage ? { backgroundImage: `url(${previewImage})` } : null">
            <div v-if="!previewImage" class="track-icon">
                <MdiIcon name="map-marker-path" />
            </div>
        </div>
        <div class="content">
            <div class="meta">
                <span class="type">{{ track.type || 'пешком' }}</span>
                <span v-if="track.length" class="sep">•</span>
                <span v-if="track.length" class="detail">{{ track.length }} км</span>
                <span v-if="track.duration" class="sep">•</span>
                <span v-if="track.duration" class="detail">{{ formatDuration(track.duration) }}</span>

            </div>

            <div class="title">{{ track.title }}</div>
            <div v-if="placesNames" class="places">{{ placesNames }}</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.card {
    overflow: hidden;
    cursor: pointer;
    height: 100%;
    border: 1px solid #e8e8e8;

    transition: all 0.3s;
    background: #fff;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
    }
}

.track-preview {
    width: 100%;
    aspect-ratio: 270 / 175;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-size: cover;
    background-position: center;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: center;
}

.track-icon {
    font-size: 80px;
    color: white;
    opacity: 0.9;
}

.content {
    padding: 12px 12px 16px 12px;
}

.meta {
    font-size: 10px;
    text-transform: uppercase;
    color: #666;
    display: flex;
    gap: 6px;
    align-items: center;
    margin-bottom: 6px;
}

.sep {
    opacity: 0.6;
}

.detail {
    color: #555;
}

.title {
    font-size: clamp(1rem, 0.55rem + 0.8vw, 1.25rem);
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
}

.places {
    font-size: 12px;
    color: #888;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

</style>
