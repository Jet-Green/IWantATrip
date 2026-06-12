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
              <button
                type="button"
                class="quick-action-card quick-action-card--stacked"
                @click="router.push('/poster')"
              >
                <div class="quick-action-card__visual">
                  <img
                    src="../../assets/plpo.webp"
                    alt="Афиши"
                    class="quick-action-card__logo"
                    loading="lazy"
                    width="200"
                    height="200"
                  />
                </div>
                <span class="quick-action-card__caption">Афиши</span>
              </button>
              <button
                type="button"
                class="quick-action-card quick-action-card--stacked"
                @click="router.push('/tracks-list')"
              >
                <div class="quick-action-card__visual">
                  <span class="quick-action-card__route-icon mdi mdi-routes" aria-hidden="true"></span>
                </div>
                <span class="quick-action-card__caption">Маршруты</span>
              </button>
              <button
                type="button"
                class="quick-action-card quick-action-card--stacked"
                @click="router.push('/excursions')"
              >
                <div class="quick-action-card__visual">
                  <span class="quick-action-card__excursion-icon mdi mdi-crowd" aria-hidden="true"></span>
                </div>
                <span class="quick-action-card__caption">Экскурсии</span>
              </button>
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

  background-image: url('../../assets/images/spiral.svg');
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
  z-index: 100;
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
  gap: clamp(14px, 4vw, 30px);
  overflow-x: auto;
  overflow-y: visible !important;
  -webkit-overflow-scrolling: touch;
}

.quick-action-card {
  flex: 0 0 auto;
  /* Fallback: под ~2.5 карточек на узком экране, если нет container queries */
  min-width: clamp(100px, 37vw, 220px);
  aspect-ratio: 1;
  background-color: rgba($color: #ffffff, $alpha: 0.7);
  border-radius: 28px;
  border: none;
  cursor: pointer;
  font: inherit;
  font-weight: 900;
  font-size: clamp(1rem, 0.5rem + 1.5vw, 1.25rem);
  color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 16px;
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: rgba($color: #ffffff, $alpha: 0.88);
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
}

@supports (width: 1cqi) {
  .quick-actions-container {
    container-type: inline-size;
    gap: clamp(12px, 4cqi, 30px);
  }

  .quick-action-card {
    /* Точнее относительно реальной ширины полосы карточек */
    min-width: clamp(96px, calc((100cqi - 40px) / 2.5), 220px);
  }
}

.quick-action-card--stacked {
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  padding: clamp(14px, 3vw, 22px);
  gap: clamp(10px, 2vw, 14px);

  &:hover .quick-action-card__logo {
    filter: drop-shadow(0 5px 16px rgba(30, 60, 80, 0.18));
  }

  &:hover .quick-action-card__route-icon,
  &:hover .quick-action-card__excursion-icon {
    filter: drop-shadow(0 5px 16px rgba(30, 60, 80, 0.2));
    transform: translateY(-1px) scale(1.03);
  }
}

.quick-action-card__visual {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 20px;
  background: radial-gradient(
    ellipse 90% 80% at 50% 45%,
    rgba(255, 255, 255, 0.65) 0%,
    rgba(255, 255, 255, 0.15) 70%,
    transparent 100%
  );
  padding: clamp(8px, 2.5vw, 16px);
  box-sizing: border-box;
}

.quick-action-card__logo {
  max-width: 88%;
  max-height: clamp(76px, 22vw, 132px);
  width: auto;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 3px 10px rgba(30, 60, 80, 0.12));
  transition: filter 0.2s ease;
}

.quick-action-card__route-icon,
.quick-action-card__excursion-icon {
  display: block;
  font-size: clamp(4.25rem, 14vw, 7rem);
  line-height: 1;
  filter: drop-shadow(0 3px 12px rgba(36, 81, 89, 0.2));
  transition: filter 0.2s ease, transform 0.2s ease;
}

.quick-action-card__route-icon {
  color: #245159;
}

.quick-action-card__excursion-icon {
  color: #2d5a4a;
}

.quick-action-card__caption {
  flex-shrink: 0;
  font-size: clamp(0.9rem, 0.65rem + 0.95vw, 1.125rem);
  font-weight: 900;
  letter-spacing: 0.04em;
  color: #152028;
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