<script setup>
import { ref, reactive, watch } from "vue";
import { useElementBounding } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useAuth } from "../../stores/auth";

const router = useRouter();
const user = useAuth();

function routeTo(buttonRoute) {
  if (buttonRoute == "/create-no-help") {
    user.isAuth ? router.push("/create-no-help") : router.push("/reg");
  } else {
    router.push(buttonRoute);
  }
}
</script>
<template>
  <a-row class="justify-center ma-16">
    <a-col :xs="24" :md="16">
      <a-row :gutter="[12, 12]">
        <a-col
          :xs="10"
          class="big-button order"
          @click="routeTo('/create-with-help')"
          ><div>Заказать</div>
          <div class="help-text">
            заполните форму <br />
            мы поможем c выбором
          </div></a-col
        >
        <a-col :xs="4" class="img"
          ><img src="../../assets/images/ship.png" alt="" style="height: 30%"
        /></a-col>
        <a-col :xs="10" class="big-button find" @click="routeTo('/trips')"
          ><div>Найти</div>
          <div class="help-text">
            используйте фильтр <br />
            выберите что нравится
          </div></a-col
        >
        <a-col :xs="7" class="img"
          ><img src="../../assets/images/house.png" alt="" style="height: 30%"
        /></a-col>
        <a-col
          :xs="10"
          class="big-button create"
          @click="routeTo('/create-no-help')"
          ><div>Создать</div>
          <div class="help-text">
            создайте тур <br />
            привлеките туристов
          </div></a-col
        >
        <a-col :xs="7" class="img"
          ><img
            src="../../assets/images/mountain.png"
            alt=""
            style="width: 30%"
        /></a-col>
        <a-col
          :xs="10"
          class="big-button companions"
          @click="routeTo('/companions')"
          ><div>Попутчики</div>
          <div class="help-text">
            найдите попутчиков <br />
            присоединитесь к другим
          </div></a-col
        >
        <a-col :xs="4" class="img"
          ><img src="../../assets/images/trees.png" alt="" style="height: 30%"
        /></a-col>

        <a-col :xs="10" class="big-button city-guide">
          <a href="#guide" style="width: 100%; height: 100%">
            <div>По городу</div>
            <div class="help-text">
              узнайте город <br />
              отдохните по полной
            </div>
          </a>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style lang="scss" scoped>
.big-button {
  width: 100%;
  aspect-ratio: 3/1;
  background: grey;
  opacity: 0.9;
  box-shadow: 5px 5px 13px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 5px 5px 13px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 5px 5px 13px 0px rgba(0, 0, 0, 0.75);
  cursor: pointer;
  border-radius: 25px;
  font-size: clamp(0.875rem, 0.5725rem + 0.6303vw, 1.25rem);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-transform: uppercase;
  a {
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
    box-shadow: 1px 1px 13px 0px rgba(0, 0, 0, 0.75);
    -webkit-box-shadow: 1px 1px 13px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 1px 1px 13px 0px rgba(0, 0, 0, 0.75);
  }
  @media (max-width: 768px) {
    aspect-ratio: 3/2;
    border-radius: 10px;
  }
}
.create {
  background: linear-gradient(rgb(32, 95, 121), rgb(34, 117, 151));
}
.find {
  background: linear-gradient(rgb(52, 49, 62), rgb(69, 65, 84));
}
.order {
  background: linear-gradient(rgb(252, 79, 6), rgb(255, 84, 14));
}
.city-guide {
  background: linear-gradient(rgb(59, 24, 25), rgb(83, 30, 33));
}
.companions {
  background: linear-gradient(rgb(91, 109, 35), rgb(111, 133, 43));
}
.img {
  display: flex;
  justify-content: end;
  align-items: flex-end;
}
.help-text {
  font-size: clamp(0.75rem, 0.5483rem + 0.4202vw, 1rem);
  text-align: center;
  text-transform: lowercase;
}
</style>
