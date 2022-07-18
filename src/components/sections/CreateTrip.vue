<script setup></script>
<template>
  <a-row class="row">
    <a-col :span="1" class="col">
      <img
        src="https://themiscochat.com/wp-content/uploads/2022/04/couple-relaxing-beach-vacation.webp"
      />
    </a-col>

    <a-col :span="8" class="col">
      <h1 style="font-weight: 900; font-size: 32px">Создайте свой тур</h1>
      <p style="width: 50%; font-weight: 500">
        Используя удобные фильтры создайте свой собственный тур
      </p>
      <a-button type="primary">Создать</a-button>
    </a-col>
  </a-row>
</template>
<style scoped>
.row {
  display: flex;
  justify-content: space-around;
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
  justify-content: center;
  flex-direction: column;
  font-size: 16px;
}
.col :nth-child(2n + 1) {
  margin: 0px;
}

img {
  width: 25vw;
  height: 29vh;
  border-radius: 25px;
}
</style>
