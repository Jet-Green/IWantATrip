<script setup>
import SlideMenu from "../components/SlideMenu.vue";
import { defineComponent, ref, reactive } from "vue";

const direction = reactive([
  {
    menuItem: "Заграница",
    image:
      "https://stolica-s.su/wp-content/uploads/2019/06/1560237775-stolica-s-su-Kak-nakopit-na-otpusk-mechty-2.jpg",
  },
  {
    menuItem: "Рядом",
    image: "https://geo-1.ru/wp-content/uploads/2018/10/21-5.jpg",
  },
  {
    menuItem: "По России",
    image:
      "https://stolica-s.su/wp-content/uploads/2019/06/1560237775-stolica-s-su-Kak-nakopit-na-otpusk-mechty-2.jpg",
  },
  {
    menuItem: "Море",
    image: "https://geo-1.ru/wp-content/uploads/2018/10/21-5.jpg",
  },
]);
</script>

<template>
  <a-layout
    :style="{
      background: `url(https://geo-1.ru/wp-content/uploads/2018/10/21-5.jpg)`,
      height: '100vh',
      'background-size': 'cover',
      'background-repeat': 'no-repeat',
      'background-position': 'center center',
    }"
  >
    <a-layout-header><h1>Хочу в поездку</h1></a-layout-header>
    <a-layout-content>
      <a-row>
        <a-col :xs="{ span: 24, order: 1 }" :sm="{ span: 12, order: 0 }">
          <a-row justify="center">
            <a-col :xs="18" :sm="14">
              <div class="selectors main_card">
                <SlideMenu :direction="direction" />
                <SlideMenu :direction="direction" />
                <SlideMenu :direction="direction" />
                <SlideMenu :direction="direction" />
                <div class="variants">посмотреть варианты</div>
              </div>
            </a-col>
          </a-row>
        </a-col>
        <a-col :xs="24" :sm="12">
          <div class="budget_info">
            <h3 class="main_card">
              Бюджет
              <span class="mdi mdi-approximately-equal"></span>
              1500 - 3000 руб.
            </h3>
          </div>
        </a-col>
      </a-row>
      <a-row style="height: 50%">
        <a-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="center_flex">
          <button class="order">Заказать тур</button>
        </a-col>
        <a-col :xs="24" :sm="12"> </a-col>
      </a-row>
    </a-layout-content>
    <a-layout-footer :style="{ bottom: 0, zIndex: 1, width: '100%' }"
      >меню текст
    </a-layout-footer>
  </a-layout>
</template>
<style lang="scss" scoped>
.ant-layout-footer,
.ant-layout-header {
  background: rgba(0, 0, 0, 0.2);
  color: white;
  h1 {
    color: white;
  }
}
.budget_info {
  display: flex;
  justify-content: flex-end;
  font-size: clamp(10px, 2vw, 18px);
  h3 {
    margin: 20px 20px 0 0;
  }
}
.selectors {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 20px;
}
.main_card {
  color: white;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.order {
  box-shadow: 1px 1px 30px white;
  font-size: 1.3em;
  &:hover {
    font-size: 1.32em;
    animation: none;
  }
  &:active {
    box-shadow: 0px 0px 5px white;
    font-size: 1.3em;
  }
}
.variants {
  font-size: clamp(12px, 2vw, 16px);
  border-radius: 10px;
  padding: 5px;
  color: #e7e68b;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 1px 1px 30px white;
  }
  &:active {
    box-shadow: none;
  }
}

button {
  color: white;
  background: #3a5168;
  transition: all 0.3s ease;
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  &:active {
    font-size: 0.9em;
  }
}
</style>
