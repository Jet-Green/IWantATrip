<script setup>
import { reactive, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RentalService from '../service/RentalService'
import RentalCard from '../components/rental/RentalCard.vue'
import '../assets/rental.scss'
const route = useRoute(), router = useRouter()
const keys = ['search', 'categorySlugs', 'priceFrom', 'priceTo', 'pickupMethod', 'unitsNeeded', 'sortBy', 'dateFrom', 'dateTo']
const today = new Date().toLocaleDateString('en-CA')
const selectedCategories = ref([])
const filters = reactive(Object.fromEntries(keys.map(key => [key, ''])))
const listings = ref([]), categories = ref([]), loading = ref(false), error = ref(''), validation = ref('')
const total = ref(0), totalPages = ref(0), page = ref(1)
let controller, requestId = 0
function sync() { keys.forEach(key => filters[key] = typeof route.query[key] === 'string' ? route.query[key] : ''); selectedCategories.value = filters.categorySlugs.split(',').filter(Boolean) }
async function load() {
  sync(); controller?.abort(); controller = new AbortController(); const current = ++requestId
  loading.value = true; error.value = ''; listings.value = []
  try {
    const { data } = await RentalService.listings({ ...Object.fromEntries(keys.filter(key => filters[key]).map(key => [key, filters[key]])), page: Number(route.query.page) || 1, limit: 12 }, controller.signal)
    if (current !== requestId) return
    listings.value = data.data; total.value = data.total; totalPages.value = data.totalPages; page.value = data.page
  } catch (err) { if (current === requestId && err.code !== 'ERR_CANCELED') error.value = 'Не удалось загрузить объекты. Попробуйте ещё раз.' }
  finally { if (current === requestId) loading.value = false }
}
function apply() {
  validation.value = ''
  filters.categorySlugs = selectedCategories.value.join(',')
  if (filters.dateFrom && filters.dateFrom < today) { validation.value = 'Дата получения не может быть в прошлом.'; return }
  if (!!filters.dateFrom !== !!filters.dateTo || (filters.dateFrom && filters.dateFrom >= filters.dateTo)) { validation.value = 'Укажите дату получения и более позднюю дату возврата.'; return }
  if (filters.priceFrom && filters.priceTo && Number(filters.priceFrom) > Number(filters.priceTo)) { validation.value = 'Цена «от» не должна превышать цену «до».'; return }
  const query = Object.fromEntries(keys.filter(key => filters[key]).map(key => [key, filters[key]]))
  if (JSON.stringify(query) === JSON.stringify(route.query)) load(); else router.push({ name: 'RentalCatalog', query })
}
function reset() { validation.value = ''; if (!Object.keys(route.query).length) { sync(); load() } else router.push({ name: 'RentalCatalog' }) }
function goPage(value) { router.push({ query: { ...route.query, page: value } }) }
watch(() => route.query, load, { immediate: true })
onMounted(async () => { try { const { data } = await RentalService.categories(); categories.value = data.data || data } catch { /* Каталог доступен и без справочника. */ } })
onBeforeUnmount(() => { requestId++; controller?.abort() })
</script>
<template>
  <div class="rental-page">
    <router-link class="rental-back" to="/">← На главную</router-link>
    <h1>Аренда инвентаря</h1>
    <form class="rental-filters" @submit.prevent="apply">
      <label class="rental-field">Название или описание<input v-model="filters.search" type="search" placeholder="Что хотите взять в аренду?" maxlength="200"></label>
      <label class="rental-field">Категория<select v-model="selectedCategories" multiple aria-describedby="rental-category-help"><option v-for="category in categories" :key="category.slug" :value="category.slug">{{ category.name || category.title }}</option></select><small id="rental-category-help">Можно выбрать несколько. Без выбора — все категории.</small></label>
      <label class="rental-field">Получение<select v-model="filters.pickupMethod"><option value="">Любой способ</option><option value="self_pickup">Самовывоз</option><option value="delivery">Доставка</option></select></label>
      <label class="rental-field">Количество<input v-model="filters.unitsNeeded" type="number" min="1" max="1000" step="1" placeholder="1"></label>
      <label class="rental-field">Цена за сутки от, ₽<input v-model="filters.priceFrom" type="number" min="0" step="1" placeholder="0"></label>
      <label class="rental-field">Цена за сутки до, ₽<input v-model="filters.priceTo" type="number" min="0" step="1" placeholder="Любая"></label>
      <label class="rental-field">Дата получения<input v-model="filters.dateFrom" type="date" :min="today"></label>
      <label class="rental-field">Дата возврата<input v-model="filters.dateTo" type="date" :min="filters.dateFrom || undefined"></label>
      <label class="rental-field">Сортировка<select v-model="filters.sortBy"><option value="">По умолчанию</option><option value="priceAsc">Сначала дешевле</option><option value="priceDesc">Сначала дороже</option></select></label>
      <p v-if="validation" role="alert" class="rental-error">{{ validation }}</p>
      <div class="rental-actions"><button class="rental-button" type="submit" :disabled="loading">Найти</button><button type="button" class="rental-button secondary" @click="reset">Сбросить</button></div>
    </form>
    <div :aria-busy="loading" aria-live="polite">
      <p v-if="loading" class="rental-state" role="status">Загружаем объекты…</p>
      <div v-else-if="error" class="rental-state" role="alert"><p>{{ error }}</p><button class="rental-button" @click="load">Повторить</button></div>
      <template v-else>
        <p>Найдено объектов: {{ total }}</p>
        <div v-if="listings.length" class="rental-grid"><RentalCard v-for="listing in listings" :key="listing.id" :listing="listing" :query="route.query" /></div>
        <div v-else class="rental-state"><h2>По вашему запросу ничего не найдено</h2><p>Измените условия или сбросьте фильтры.</p><button class="rental-button secondary" @click="reset">Сбросить фильтры</button></div>
        <nav v-if="totalPages > 1" class="rental-pagination" aria-label="Страницы каталога"><button class="rental-button secondary" :disabled="page <= 1" @click="goPage(page - 1)">Назад</button><span>{{ page }} из {{ totalPages }}</span><button class="rental-button secondary" :disabled="page >= totalPages" @click="goPage(page + 1)">Далее</button></nav>
      </template>
    </div>
  </div>
</template>
