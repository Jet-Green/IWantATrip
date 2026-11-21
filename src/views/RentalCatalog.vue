<script setup>
import { computed, reactive, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RentalService from '../service/RentalService'
import dayjs from 'dayjs'
import dateLocale from 'ant-design-vue/es/date-picker/locale/ru_RU'
import 'dayjs/locale/ru'
import RentalCard from '../components/rental/RentalCard.vue'
import '../assets/rental.scss'
const route = useRoute(), router = useRouter()
const keys = ['search', 'categorySlugs', 'priceFrom', 'priceTo', 'pickupMethod', 'unitsNeeded', 'sortBy', 'dateFrom', 'dateTo']
const today = dayjs().format('YYYY-MM-DD')
const filterOpen = ref(false)
const hasValue = value => value !== '' && value !== null && value !== undefined
const hasFilters = computed(() => keys.some(key => hasValue(route.query[key])))
const filterSummary = computed(() => {
  const query = route.query
  const parts = [query.search]
  const selected = String(query.categorySlugs || '').split(',').filter(Boolean)
  if (selected.length) parts.push(selected.map(slug => categories.value.find(category => category.slug === slug)?.name || categories.value.find(category => category.slug === slug)?.title || slug).join(', '))
  if (query.dateFrom && query.dateTo) parts.push(`${dayjs(query.dateFrom).format('DD.MM.YYYY')} — ${dayjs(query.dateTo).format('DD.MM.YYYY')}`)
  if (hasValue(query.priceFrom)) parts.push(`от ${query.priceFrom} ₽`)
  if (hasValue(query.priceTo)) parts.push(`до ${query.priceTo} ₽`)
  if (query.pickupMethod) parts.push(query.pickupMethod === 'delivery' ? 'Доставка' : 'Самовывоз')
  if (query.unitsNeeded) parts.push(`${query.unitsNeeded} шт.`)
  if (query.sortBy) parts.push(query.sortBy === 'priceAsc' ? 'Сначала дешевле' : 'Сначала дороже')
  return parts.filter(Boolean).join(', ') || 'Что хотите взять в аренду?'
})
function openFilters() { sync(); validation.value = ''; filterOpen.value = true }
function disabledDate(date) { return date && date.startOf('day').isBefore(dayjs().startOf('day')) }
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
    const { data } = await RentalService.listings({ ...Object.fromEntries(keys.filter(key => hasValue(filters[key])).map(key => [key, filters[key]])), page: Number(route.query.page) || 1, limit: 12 }, controller.signal)
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
  if (['priceFrom', 'priceTo'].some(key => hasValue(filters[key]) && (!Number.isFinite(Number(filters[key])) || Number(filters[key]) < 0))) { validation.value = 'Укажите неотрицательную цену.'; return }
  if (hasValue(filters.unitsNeeded) && (!Number.isInteger(Number(filters.unitsNeeded)) || Number(filters.unitsNeeded) < 1 || Number(filters.unitsNeeded) > 1000)) { validation.value = 'Количество должно быть целым числом от 1 до 1000.'; return }
  if (hasValue(filters.priceFrom) && hasValue(filters.priceTo) && Number(filters.priceFrom) > Number(filters.priceTo)) { validation.value = 'Цена «от» не должна превышать цену «до».'; return }
  const query = Object.fromEntries(keys.filter(key => hasValue(filters[key])).map(key => [key, String(filters[key])]))
  filterOpen.value = false
  if (JSON.stringify(query) === JSON.stringify(route.query)) load(); else router.push({ name: 'RentalCatalog', query })
}
function reset() { filterOpen.value = false; validation.value = ''; if (!Object.keys(route.query).length) { sync(); load() } else router.push({ name: 'RentalCatalog' }) }
function goPage(value) { router.push({ query: { ...route.query, page: value } }) }
watch(() => route.query, load, { immediate: true })
onMounted(async () => { try { const { data } = await RentalService.categories(); categories.value = data.data || data } catch { /* Каталог доступен и без справочника. */ } })
onBeforeUnmount(() => { requestId++; controller?.abort() })
</script>
<template>
  <div class="rental-catalog">
    <a-row justify="center">
      <a-col :xs="22" :md="20" :xl="18">
        <router-link class="rental-catalog-back mb-8" to="/" aria-label="Назад на главную"><MdiIcon name="arrow-left" /><span>Назад</span></router-link>
        <h1 class="rental-catalog-title">Аренда инвентаря</h1>
      </a-col>
    </a-row>
    <a-row class="d-flex justify-center rental-filter-row">
      <a-col :xs="24" :md="16" :lg="12" class="pa-16">
        <div class="rental-filter-bar">
          <button type="button" class="rental-filter-trigger" :title="filterSummary" aria-haspopup="dialog" :aria-expanded="filterOpen" @click="openFilters">{{ filterSummary }}</button>
          <a-button v-if="hasFilters" type="primary" shape="circle" class="ml-8" aria-label="Очистить фильтры" @click="reset"><MdiIcon name="close" /></a-button>
        </div>
      </a-col>
    </a-row>
    <a-modal v-model:open="filterOpen" title="Поиск инвентаря" class="rental-filter-modal">
      <a-form id="rental-filter-form" :model="filters" layout="vertical" class="rental-catalog-form" @finish="apply">
        <a-row :gutter="[8, 8]">
          <a-col :span="24">
            <a-form-item label="Название или описание" name="search" html-for="rental-search">
              <a-input id="rental-search" v-model:value="filters.search" placeholder="Что хотите взять в аренду?" :maxlength="200" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Категория" name="categorySlugs" html-for="rental-categories">
              <a-select id="rental-categories" v-model:value="selectedCategories" mode="multiple" placeholder="Все категории" :max-tag-count="2" option-filter-prop="label" allow-clear :options="categories.map(category => ({ value: category.slug, label: category.name || category.title }))" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Получение" name="pickupMethod" html-for="rental-pickup">
              <a-select id="rental-pickup" v-model:value="filters.pickupMethod" :options="[{ value: '', label: 'Любой способ' }, { value: 'self_pickup', label: 'Самовывоз' }, { value: 'delivery', label: 'Доставка' }]" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Количество" name="unitsNeeded" html-for="rental-units">
              <a-input-number id="rental-units" v-model:value="filters.unitsNeeded" :min="1" :max="1000" :step="1" placeholder="1" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Цена за сутки от, ₽" name="priceFrom" html-for="rental-price-from">
              <a-input-number id="rental-price-from" v-model:value="filters.priceFrom" :min="0" :step="1" placeholder="0" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Цена за сутки до, ₽" name="priceTo" html-for="rental-price-to">
              <a-input-number id="rental-price-to" v-model:value="filters.priceTo" :min="0" :step="1" placeholder="Любая" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Дата получения" name="dateFrom" html-for="rental-date-from">
              <a-date-picker id="rental-date-from" v-model:value="filters.dateFrom" :locale="dateLocale" value-format="YYYY-MM-DD" format="DD.MM.YYYY" placeholder="Дата" :disabled-date="disabledDate" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Дата возврата" name="dateTo" html-for="rental-date-to">
              <a-date-picker id="rental-date-to" v-model:value="filters.dateTo" :locale="dateLocale" value-format="YYYY-MM-DD" format="DD.MM.YYYY" placeholder="Дата" :disabled-date="date => disabledDate(date) || (filters.dateFrom && date.format('YYYY-MM-DD') <= filters.dateFrom)" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Сортировка" name="sortBy" html-for="rental-sort">
              <a-select id="rental-sort" v-model:value="filters.sortBy" :options="[{ value: '', label: 'По умолчанию' }, { value: 'priceAsc', label: 'Сначала дешевле' }, { value: 'priceDesc', label: 'Сначала дороже' }]" />
            </a-form-item>
          </a-col>
          <a-col v-if="validation" :span="24"><p role="alert" class="rental-error">{{ validation }}</p></a-col>
        </a-row>
      </a-form>
      <template #footer>
        <a-button type="primary" shape="round" html-type="submit" form="rental-filter-form" :loading="loading">Показать</a-button>
        <a-button shape="round" @click="reset">Очистить</a-button>
      </template>
    </a-modal>
    <a-row justify="center" :aria-busy="loading" aria-live="polite">
      <a-col :xs="22" :md="20" :xl="18">
        <div v-if="loading" class="rental-catalog-state" role="status">
          <img src="../assets/images/founddog.webp" alt="" />
          <p>Загружаем объекты…</p>
        </div>
        <div v-else-if="error" class="rental-catalog-state" role="alert">
          <p>{{ error }}</p>
          <a-button type="primary" shape="round" @click="load">Повторить</a-button>
        </div>
        <template v-else>
          <p class="rental-catalog-count">Найдено объектов: {{ total }}</p>
          <a-row v-if="listings.length" :gutter="[16, 18]" class="d-flex justify-center mt-8 pb-24">
            <a-col v-for="listing in listings" :key="listing.id" :xs="24" :sm="12" :md="8" :xl="6" class="d-flex">
              <RentalCard :listing="listing" :query="route.query" />
            </a-col>
          </a-row>
          <div v-else class="rental-catalog-state">
            <img src="../assets/images/notfound.jpg" alt="" />
            <h2>Я ничего не нашёл</h2>
            <p>Измените условия или сбросьте фильтры.</p>
            <a-button shape="round" @click="reset">Сбросить фильтры</a-button>
          </div>
          <nav v-if="totalPages > 1" class="rental-catalog-pagination" aria-label="Страницы каталога">
            <a-pagination :current="page" :total="total" :page-size="12" :show-size-changer="false" simple @change="goPage" />
          </nav>
        </template>
      </a-col>
    </a-row>
  </div>
</template>
<style lang="scss" scoped>
.rental-catalog { padding-bottom: 24px; }
.rental-catalog-title { font-size: clamp(1.5rem, 1.1975rem + .6303vw, 1.875rem); font-weight: 900; margin: 0 0 4px; }
.rental-catalog-back { display: flex; align-items: center; width: fit-content; min-height: 32px; gap: 8px; color: rgba(0, 0, 0, .88); font-size: 16px; }
.rental-catalog-back :deep(svg) { width: 16px; height: 16px; margin: 0 8px; }
.rental-catalog-back:focus-visible { outline: 2px solid #ff6600; outline-offset: 3px; border-radius: 4px; }
.rental-catalog-count { margin: 8px 0; font-size: 14px; }
.rental-catalog-state { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 8px 0 24px; }
.rental-catalog-state img { height: 150px; max-width: 100%; object-fit: contain; }
.rental-catalog-state h2 { font-size: 1.17em; font-weight: 700; }
.rental-catalog-pagination { display: flex; justify-content: center; margin: 8px 0 24px; }
@media (max-width: 767px) { .rental-catalog-back span { display: none; } }
</style>
