<script setup></script>
<template>
  <a-row class="row">
    <a-col :xs="24" :md="12" :lg="10" class="col pa-16">
      <img src="https://themiscochat.com/wp-content/uploads/2022/04/couple-relaxing-beach-vacation.webp" />
    </a-col>

    <a-col :xs="24" :md="12" :lg="8" class="d-flex align-center pa-16">
      <div class="col">
        <a-typography-title :level="2">
          Создайте свой тур
        </a-typography-title>
        <p style="width: 50%; font-weight: 500">
          Используя удобные фильтры создайте свой собственный тур
        </p>
        <a-button type="primary">Создать</a-button>
      </div>
    </a-col>
  </a-row>
</template>
<style scoped>
.row {
  display: flex;
  justify-content: space-between;
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
  width: 100%;
  border-radius: 25px;
}
</style>
