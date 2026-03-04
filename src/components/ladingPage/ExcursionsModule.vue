<script setup>
import ExcursionFilter from '../sections/ExcursionFilter.vue';
import ExcursionCard from '../_guide/ExcursionCard.vue';
import { ref } from 'vue';
import { useExcursion } from '../../stores/excursion';

import { useRouter } from 'vue-router';

const router = useRouter()
const excursionStore = useExcursion()

const scrollContainer = ref(null)

function scrollLeft() {
  if (!scrollContainer.value) return
  const width = scrollContainer.value.clientWidth
  scrollContainer.value.scrollBy({
    left: -width,
    behavior: 'smooth'
  })
}

function scrollRight() {
  if (!scrollContainer.value) return
  const width = scrollContainer.value.clientWidth
  scrollContainer.value.scrollBy({
    left: +width,
    behavior: 'smooth'
  })
}
</script>
<template>
  <div class="container">
    <div class="module-card">
      <div class="cols-22">
        <h3 v-if="excursionStore.excursions.length > 0">Экскурсии</h3>
        <h3 v-else>Экскурсии не найдены...</h3>
        <!-- это костыль) чтобы экскурсии загрузились в стор и локация тоже учлась -->
        <div v-show="false">
          <ExcursionFilter />
        </div>
        <div v-if="excursionStore.excursions.length > 0">
          <div class="scroll-container" :gutter="[16, 16]" ref="scrollContainer">
            <div class="scroll-container-col"
              v-for="ex of [...excursionStore.excursions, ...excursionStore.excursions, ...excursionStore.excursions, ...excursionStore.excursions, ...excursionStore.excursions]"
              :key="ex._id">
              <ExcursionCard :excursion="ex" @click="router.push(`/excursion?_id=${ex._id}`)" :id="ex._id" />
            </div>
          </div>
        </div>

        <div class="actions">
          <button class="see-all-btn unselectable" @click="router.push('/excursions')">Смотреть все</button>

          <div class="slider-btns-container" v-if="excursionStore.excursions.length > 0">
            <button class="slider-btn" @click="scrollLeft">
              <span class="mdi mdi-chevron-left"></span>
            </button>
            <div class="divider"></div>
            <button class="slider-btn" @click="scrollRight">
              <span class="mdi mdi-chevron-right"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
h3 {
  font-size: clamp(1rem, -0.1932rem + 3.4091vw, 2.5rem);
  font-weight: 900;
  line-height: 1;
}

.container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.module-card {
  background: white;
  border-radius: 28px;
  width: calc(100vw*23/24);
  padding: calc(100vw*0.5/24) 0;
  display: flex;
  justify-content: center;

}

.cols-22 {
  width: calc(100vw*22/24)
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.see-all-btn {
  background-color: #FF6600;
  border-radius: 999px;
  border: 0px;
  padding: 10px 50px;
  text-transform: none;
  font-size: clamp(0.875rem, 0.179rem + 1.9886vw, 1.75rem);
  color: white;
  cursor: pointer;

  transition: all 0.28s ease;
  transform: scale(1);

  &:hover {
    transform: scale(1.01);
  }

  &:active {
    transform: scale(0.97);
  }
}

.slider-btn {
  background-color: #63BED8;
  height: 50px;
  width: 50px;
  border-radius: 999px;
  border: 0;
  font-size: 30px;
  cursor: pointer;
  transition: all 0.28s ease;
  transform: scale(1);

  &:hover {
    transform: scale(1.01);
  }

  &:active {
    transform: scale(0.9);
  }
}

.divider {
  height: 70%;
  background-color: #FF6600;
  width: 1px;
  margin-right: 10px;
  margin-left: 10px;
}

.slider-btns-container {
  display: flex;
  align-items: center;
  height: 50px;
}

.scroll-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 16px;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  .scroll-container-col {
    flex: 0 0 100%;
    min-width: 0;
  }

  @media (min-width: 520px) {
    .scroll-container-col {
      flex: 0 0 calc(50% - 8px);
    }
  }

  @media (min-width: 768px) {
    .scroll-container-col {
      flex: 0 0 calc((100% - 32px) / 3);
    }
  }

  @media (min-width: 1200px) {
    .scroll-container-col {
      flex: 0 0 calc((100% - 48px) / 4);
    }
  }

  .scroll-container::-webkit-scrollbar {
    display: none;
  }
}
</style>