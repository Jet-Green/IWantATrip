<script setup></script>
<template>
  <a-col :span="24" class="create_trip">
    <a-row class="row" :gutter="16">
      <a-col
        :xs="12"
        class="pa-16"
        style="display: flex; justify-content: flex-end"
      >
        <img
          src="https://themiscochat.com/wp-content/uploads/2022/04/couple-relaxing-beach-vacation.webp"
        />
      </a-col>

      <a-col :xs="12" class="d-flex align-center  pa-16">
        <div class="col">
          <h2>Создай свой тур</h2>
          <p>Твой тур - твои правила</p>
          <a-button type="primary">Создать</a-button>
        </div>
      </a-col>
    </a-row>
  </a-col>
</template>
<style scoped>
.create_trip {
  background: #f7f7f7;
  min-height: 25vh;
}

.ant-btn-primary {
  background: #02aff2;
  border-color: #019edb;
  width: 50%;
  height: 17%;
  border-radius: 100px;
}

.col {
  display: flex;
  flex-direction: column;
}

/* 
Зачем так сложно?
.col :nth-child(2n + 1) {
  margin: 0px;
} */

img {
  /* Картинку штырит, лучше, чтобы она была 100% ширины родителя. А высота сама поставится
    width: 25vw;
    height: 29vh;
  */
  aspect-ratio: 18/10;
  min-width: 200px;
  border-radius: 25px;
}
</style>
