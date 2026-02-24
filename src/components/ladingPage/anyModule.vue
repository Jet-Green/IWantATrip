<script setup></script>
<template>
  <div class="container">
    <div class="module-card">
      <div class="cols-22">
        <h3>Экскурсии</h3>
        <div style="height: 400px;">
          тут экскурсии
        </div>

        <div class="actions">
          <button class="see-all-btn unselectable">Смотреть все</button>

          <div class="slider-btns-container">
            <button class="slider-btn">
              <span class="mdi mdi-chevron-left"></span>
            </button>
            <div class="divider"></div>
            <button class="slider-btn">
              <span class="mdi mdi-chevron-right"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
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
}

.slider-btn {
  background-color: #63BED8;
  height: 50px;
  width: 50px;
  border-radius: 999px;
  border: 0;
  font-size: 30px;
  cursor: pointer;
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
</style>