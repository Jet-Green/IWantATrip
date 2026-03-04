<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()
</script>
<template>
  <div class="container">
    <a-row style="height: 100vh;" type="flex" justify="center" align="center">
      <a-col :span="22" class="d-flex align-center">
        <h1 class="big-text">Выбирайте город<br>
          и планируйте путешествие<br>
          прямо сейчас!</h1>
      </a-col>
      <a-col :span="22">
        <a-row class="d-flex space-between">
          <a-col :span="24" :order="2" :md="{ span: 6, order: 1 }" class="d-flex align-center">
            <button class="select-trip-btn" @click="router.push('/trips')">
              Выбрать тур
            </button>
          </a-col>
          <a-col :span="24" :order="1" :md="{ span: 14, order: 2 }" class="relative">
            <!-- позиционирование иконок происходит относительно блока с карточками быстрого действия -->
            <img src="../../assets/images/ship.svg" alt="" class="ship-icon absolute">
            <img src="../../assets/images/double-tree.svg" alt="" class="double-tree-icon absolute">
            <div class="quick-actions-container">
              <div v-for="(item) in 7" :span="4" class="quick-action-card">
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>

  </div>
</template>
<style scoped lang="scss">
.container {
  min-height: 100vh;
  background-color: #63BED8;
  border-bottom-right-radius: 70px;
  border-bottom-left-radius: 70px;

  background-image: url('src/assets/images/spiral.svg');
  background-repeat: no-repeat;
  background-position: bottom right;
  background-size: auto 50%;
}

.big-text {
  margin-top: 80px;
  font-size: clamp(2rem, -0.3864rem + 6.8182vw, 5rem);
  line-height: 1;
  font-weight: 900;
  color: white;
}

.select-trip-btn {
  display: block;
  width: 100%;
  color: black;
  background-color: white;
  border: none;
  cursor: pointer;
  text-transform: none;
  font-weight: 900;
  border-radius: 100px;
  font-size: clamp(1rem, 0.1051rem + 2.5568vw, 2.125rem);
  padding: 20px 0px;
  transition: all 0.28s ease;
  transform: scale(1);

  &:hover {
    transform: scale(1.01);
  }

  &:active {
    transform: scale(0.97);
  }
}

.quick-actions-container {
  display: flex;
  gap: 30px;
  overflow-x: scroll;
  overflow-y: visible !important;
}

.quick-action-card {
  // height: 300px;
  flex: 0 0 auto; // ← важно: не растягивать, но и не сжимать ниже содержимого
  min-width: 220px; // ← минимальная ширина, с которой карточка комфортна
  aspect-ratio: 1;
  background-color: rgba($color: #ffffff, $alpha: 0.7);
  border-radius: 28px;
}

.ship-icon {
  height: 70px;
  top: -75px;
  left: 25%;
}

.double-tree-icon {
  height: clamp(5.625rem, 2.642rem + 8.5227vw, 9.375rem);
  right: 10%;
  top: calc(-10% - clamp(5.625rem, 2.642rem + 8.5227vw, 9.375rem));
}
</style>