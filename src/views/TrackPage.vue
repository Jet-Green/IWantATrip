<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useShare } from '@vueuse/core'
import { useHead } from "@unhead/vue"
import BackButton from "../components/BackButton.vue"
import { useRoute, useRouter } from "vue-router"
import { useTracks } from "../stores/track"
import PlaceService from '../service/PlaceService'

const route = useRoute()
const router = useRouter()
const _id = route.query._id
const API_URL = import.meta.env.VITE_API_URL

const trackStore = useTracks()

const trackData = ref({})
const mapContainer = ref(null)
let map = null
let userLocationMarker = null
const userLocation = ref(null)
const locationError = ref(null)
const isLoading = ref(true)

const backRoute = { name: 'TracksPage', hash: `#${_id}` }

let link = computed(() => {
    return API_URL + route.fullPath
})

const options = ref({
    url: link.value,
    title: trackData.value.title,
})

useHead(computed(() => ({
    title: trackData.value?.title,
    meta: [
        {
            name: "description",
            content: trackData.value?.description,
        },
        {
            property: "og:title",
            content: trackData.value?.title,
        },
        {
            name: "og:description",
            content: trackData.value?.description,
        },
        {
            name: "og:url",
            content: `${API_URL}/track?_id=${trackData.value?._id}`,
        },
    ],
    link: [{ rel: "canonical", href: `${API_URL}/track?_id=${trackData.value?._id}` }],
})))

const { isSupported } = useShare(options)

async function startShare() {
    const { share } = useShare(options)
    return share().catch(err => {
        console.log(err)
    })
}

const formatDuration = (minutes) => {
    if (!minutes) return 'не рассчитано'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
        return `${hours} ч ${mins} мин`
    }
    return `${mins} мин`
}

const buildRoute = async () => {
    if (!trackData.value.places || trackData.value.places.length < 2) {
        return
    }

    const coords = trackData.value.places.map(p => p.location.coordinates.join(',')).join(';')
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

const getUserLocation = () => {
    locationError.value = null

    if (!navigator.geolocation) {
        locationError.value = 'Геолокация не поддерживается вашим браузером'
        return
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { longitude, latitude } = position.coords
            userLocation.value = [longitude, latitude]

            // Удаляем предыдущий маркер, если он был
            if (userLocationMarker) {
                userLocationMarker.remove()
            }

            // Создаем элемент маркера для текущего местоположения
            const el = document.createElement('div')
            el.className = 'user-location-marker'

            // Добавляем маркер на карту
            userLocationMarker = new maplibregl.Marker({ element: el })
                .setLngLat([longitude, latitude])
                .setPopup(
                    new maplibregl.Popup({ offset: 25 })
                        .setHTML('<h3>Ваше местоположение</h3>')
                )
                .addTo(map)

            // Центрируем карту на местоположении пользователя
            map.flyTo({
                center: [longitude, latitude],
                zoom: 15,
                duration: 1000
            })
        },
        (error) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    locationError.value = 'Вы запретили доступ к геолокации'
                    break
                case error.POSITION_UNAVAILABLE:
                    locationError.value = 'Информация о местоположении недоступна'
                    break
                case error.TIMEOUT:
                    locationError.value = 'Время ожидания истекло'
                    break
                default:
                    locationError.value = 'Произошла неизвестная ошибка'
            }
        }
    )
}

onMounted(async () => {
    // Загружаем данные маршрута
    try {
        const response = await trackStore.getById(_id)
        if (response.status === 200 && response.data) {
            trackData.value = response.data

            // Проверяем, нужно ли загружать полную информацию о местах
            if (trackData.value.places && Array.isArray(trackData.value.places)) {
                // Если первый элемент - строка (ID), загружаем места
                if (trackData.value.places.length > 0 && typeof trackData.value.places[0] === 'string') {
                    const placesWithDetails = []
                    for (let placeId of trackData.value.places) {
                        try {
                            const placeResponse = await PlaceService.getById(placeId)
                            if (placeResponse.status === 200 && placeResponse.data) {
                                placesWithDetails.push(placeResponse.data)
                            }
                        } catch (error) {
                            console.error(`Ошибка загрузки места ${placeId}:`, error)
                        }
                    }
                    trackData.value.places = placesWithDetails
                }
                // Иначе места уже загружены с сервера как объекты
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки маршрута:', error)
    } finally {
        isLoading.value = false
    }

    // Ждем следующего тика для инициализации карты после рендеринга DOM
    await new Promise(resolve => setTimeout(resolve, 100))

    // Инициализация карты после загрузки данных
    if (trackData.value.places && trackData.value.places.length > 0 && mapContainer.value) {
        initMap()
    }
})

const initMap = () => {
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
        center: [trackData.value.places[0].location.coordinates[0], trackData.value.places[0].location.coordinates[1]],
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
                .setLngLat(place.location.coordinates)
                .setPopup(
                    new maplibregl.Popup({ offset: 25 })
                        .setHTML(`<h3>${place.name}</h3>`)
                )
                .addTo(map)
        })
    })
}

onBeforeUnmount(() => {
    if (map) {
        map.remove()
    }
    if (userLocationMarker) {
        userLocationMarker.remove()
    }
})
</script>
<template>
    <div style="overflow-x: hidden">
        <BackButton :backRoute="backRoute" />
        <a-row class="justify-center d-flex">
            <a-spin v-if="isLoading" size="large"></a-spin>

            <a-col :xs="22" :xl="16" class="mb-32" v-else-if="trackData._id">
                <h2>{{ trackData.title }}</h2>
                <div class="track-subtitle">{{ trackData.subtitle }}</div>

                <a-row :gutter="[12, 12]" class="text justify-center d-flex mt-4">
                    <a-col :xs="24" class="track-info-card">
                        <div style="float: right;">
                            <span v-if="isSupported" style="opacity: 0.7; cursor: pointer;"
                                class="mdi mdi-24px mdi-share-variant-outline" @click="startShare()"></span>
                        </div>


                        <div>

                            {{ trackData.type || 'пешком' }}  {{ trackData.length }} км  {{
                            formatDuration(trackData.duration) }} </div>


                        <div>
                            <span v-for="(place, index) in trackData.places" :key="place._id">
                                <a @click="router.push(`/place?_id=${place._id}`)" class="place-link">
                                    {{ place.name }}
                                </a>
                                <span v-if="index < trackData.places.length - 1"> - </span>
                            </span>
                        </div>



                    </a-col>
                </a-row>

                <a-row class="mt-16" v-if="trackData.description">
                    <a-col :span="24">
                        <div class="text track-description" v-html="trackData.description"></div>
                    </a-col>
                </a-row>

                <a-row class="mt-16">
                    <a-col :span="24">
                        <div class="map-container">
                            <div ref="mapContainer" class="map"></div>
                            <button @click="getUserLocation" class="location-button"
                                title="Показать моё местоположение">
                                📍
                            </button>
                            <div v-if="locationError" class="location-error">
                                {{ locationError }}
                            </div>
                        </div>
                    </a-col>
                </a-row>
            </a-col>

            <a-col :xs="22" :xl="16" v-else>
                <a-result status="404" title="Маршрут не найден"
                    sub-title="Возможно, маршрут был удален или не существует">
                    <template #extra>
                        <a-button type="primary" @click="router.push('/tracks')">
                            Вернуться к списку маршрутов
                        </a-button>
                    </template>
                </a-result>
            </a-col>
        </a-row>
    </div>
</template>



<style scoped>
.map-container {
    width: 100%;
    height: 500px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: relative;
}

.map {
    width: 100%;
    height: 100%;
}

.location-button {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    transition: background-color 0.2s;
}

.location-button:hover {
    background-color: #f0f0f0;
}

.location-button:active {
    background-color: #e0e0e0;
}

.location-error {
    position: absolute;
    top: 60px;
    right: 10px;
    background-color: #ffebee;
    color: #c62828;
    padding: 10px 15px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    font-size: 14px;
    max-width: 250px;
    z-index: 1;
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

:deep(.user-location-marker) {
    background-color: #1976D2;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    border: 3px solid white;
    box-shadow: 0 0 10px rgba(25, 118, 210, 0.5);
    position: relative;
}

:deep(.user-location-marker::after) {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(25, 118, 210, 0.2);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 1;
    }

    100% {
        transform: translate(-50%, -50%) scale(1.5);
        opacity: 0;
    }
}
</style>
