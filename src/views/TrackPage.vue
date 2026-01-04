<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { trackMockData } from '../db/trackMock.js'

const trackData = ref(trackMockData)
const mapContainer = ref(null)
let map = null

const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
        return `${hours} ч ${mins} мин`
    }
    return `${mins} мин`
}

const buildRoute = async () => {
    const coords = trackData.value.places.map(p => p.coordinates.join(',')).join(';')
    const url = `https://router.project-osrm.org/route/v1/foot/${coords}?overview=full&geometries=geojson`

    try {
        const res = await fetch(url)
        const data = await res.json()
        
        if (data.routes && data.routes[0]) {
            const route = data.routes[0].geometry
            
            // Обновляем длину маршрута (из метров в км)
            const distanceKm = data.routes[0].distance / 1000
            trackData.value.length = distanceKm.toFixed(2)
            
            // Рассчитываем время с учетом средней скорости пешехода (5 км/ч)
            const pedestrianSpeed = 3.5 // км/ч
            const durationHours = distanceKm / pedestrianSpeed
            trackData.value.duration = Math.round(durationHours * 60) // в минуты

            map.addSource('route', { type: 'geojson', data: route })

            map.addLayer({
                id: 'route-line',
                type: 'line',
                source: 'route',
                paint: {
                    'line-width': 5,
                    'line-color': '#ff0000'
                }
            })

            // Подгоняем границы карты
            const bounds = new maplibregl.LngLatBounds()
            route.coordinates.forEach(coord => {
                bounds.extend(coord)
            })
            map.fitBounds(bounds, { padding: 50 })
        }
    } catch (error) {
        console.error('Ошибка при построении маршрута:', error)
    }
}

onMounted(() => {
    // Инициализация карты
    map = new maplibregl.Map({
        container: mapContainer.value,
        style: {
            version: 8,
            sources: {
                osm: {
                    type: 'raster',
                    tiles: [
                        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    ],
                    tileSize: 256,
                    attribution: '© OpenStreetMap contributors'
                }
            },
            layers: [
                {
                    id: 'osm',
                    type: 'raster',
                    source: 'osm'
                }
            ]
        },
        center: [50.12, 53.22],
        zoom: 12
    })

    map.on('load', async () => {
        // Строим маршрут
        await buildRoute()
        
        // Добавляем маркеры для каждого места
        trackData.value.places.forEach((place, index) => {
            const el = document.createElement('div')
            el.className = 'custom-marker'
            el.textContent = index + 1

            new maplibregl.Marker({ element: el })
                .setLngLat(place.coordinates)
                .setPopup(
                    new maplibregl.Popup({ offset: 25 })
                        .setHTML(`<h3>${place.name}</h3>`)
                )
                .addTo(map)
        })
    })
})

onBeforeUnmount(() => {
    if (map) {
        map.remove()
    }
})
</script>
<template>
    <div class="track-page">
        <div class="track-header">
            <h1>{{ trackData.title }}</h1>
            <h2>{{ trackData.subtitle }}</h2>
        </div>

        <div class="track-content">
            <div class="track-info">
                <div class="info-item">
                    <span class="label">Тип маршрута:</span>
                    <span class="value">{{ trackData.type }}</span>
                </div>
                <div class="info-item">
                    <span class="label">Длина:</span>
                    <span class="value">{{ trackData.length }} км</span>
                </div>
                <div class="info-item">
                    <span class="label">Время:</span>
                    <span class="value">{{ formatDuration(trackData.duration) }}</span>
                </div>
            </div>

            <div class="track-description">
                <p>{{ trackData.description }}</p>
            </div>

            <div class="places-list">
                <h3>Места на маршруте:</h3>
                <ul>
                    <li v-for="place in trackData.places" :key="place._id">
                        {{ place.name }}
                    </li>
                </ul>
            </div>

            <div class="map-container">
                <div ref="mapContainer" class="map"></div>
            </div>
        </div>
    </div>
</template>



<style scoped>
.track-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.track-header {
    margin-bottom: 30px;
}

.track-header h1 {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
}

.track-header h2 {
    font-size: 20px;
    font-weight: normal;
    color: #666;
}

.track-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.track-info {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 8px;
}

.info-item {
    display: flex;
    gap: 8px;
}

.info-item .label {
    font-weight: 600;
    color: #555;
}

.info-item .value {
    color: #333;
}

.track-description {
    line-height: 1.6;
    color: #444;
}

.places-list h3 {
    font-size: 20px;
    margin-bottom: 10px;
    color: #333;
}

.places-list ul {
    list-style: none;
    padding: 0;
}

.places-list li {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}

.places-list li:last-child {
    border-bottom: none;
}

.map-container {
    width: 100%;
    height: 500px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map {
    width: 100%;
    height: 100%;
}

:deep(.custom-marker) {
    background-color: #4285F4;
    color: white;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    cursor: pointer;
}

:deep(.maplibregl-popup-content) {
    padding: 10px;
    border-radius: 8px;
}

:deep(.maplibregl-popup-content h3) {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
}
</style>
