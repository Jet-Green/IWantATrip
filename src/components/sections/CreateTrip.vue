<script setup></script>
<template>
  <a-row type="flex" justify="center" class="create_trip_bg pt-16 pb-16">
    <a-col :xs="22" :lg="16">
      <a-row type="flex" justify="space-between">
        <a-col :xs="{ span: 20, offset: 2 }" :md="12" :lg="8">
          <img src="https://themiscochat.com/wp-content/uploads/2022/04/couple-relaxing-beach-vacation.webp" />
        </a-col>

        <a-col :xs="24" :md="{ span: 6, offset: 3 }" class="col">
          <h2>Создай свой тур</h2>
          <p>Твой тур - твои правила</p>
          <a-button type="primary">Создать</a-button>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>
<style scoped>
.create_trip_bg {
  background: #f7f7f7;
  min-height: 25vh;
}

.ant-btn-primary {
  background: #02aff2;
  border-color: #019edb;
  /* width: 50%;
  height: 17%; */
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
  aspect-ratio: 18/10;
  border-radius: 25px;
}
</style>
