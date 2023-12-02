<script setup>
import { RouterLink, useRouter } from 'vue-router';

import BackButton from "../BackButton.vue";
const backRoute = { name: 'Landing', hash: '#guide' };
const router = useRouter()

let toLink = () => {
  window.open('https://yandex.ru/maps/transport', '_blank')
}
function routeTo(buttonRoute) {

  router.push(buttonRoute);

}
</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />
    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="16">
        <h2>
          Транспорт
        </h2>
      </a-col>
    </a-row>
    <a-row class="justify-center ma-16">
      <a-col :xs="24" :md="16">
        <a-row :gutter="[12, 12]">

          <a-col :xs="10" class="big-button public" @click=" toLink()">

            Общественный транспорт

          </a-col>
          <a-col :xs="4" class="img"><img src="../../assets/images/ship.webp" alt="" style="height: 30%" /></a-col>
          <a-col :xs="10" class="big-button order">
            <div>Заказать транспорт</div>
            <div class="help-text">

            </div>
          </a-col>
          <a-col :xs="7" class="img"><img src="../../assets/images/car.webp" alt="" style="height: 25%" /></a-col>
          <a-col :xs="10" class="big-button taxi" @click="routeTo('/taxi')">
            <div>Такси</div>
            <div class="help-text">

            </div>
          </a-col>
          <a-col :xs="4" class="img"><img src="../../assets/images/trees.webp" alt="" style="height: 30%" /></a-col>

        </a-row>
      </a-col>
    </a-row>

  </div>
</template>
<style lang="scss" scoped>
.big-button {
  width: 100%;
  aspect-ratio: 3/1;
  // background: grey;
  opacity: 0.9;
  box-shadow: 5px 5px 13px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 5px 5px 13px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 5px 5px 13px 0px rgba(0, 0, 0, 0.75);
  cursor: pointer;
  border-radius: 25px;
  font-size: clamp(0.875rem, 0.5725rem + 0.6303vw, 1.25rem);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-transform: uppercase;
  text-align: center;
  transition: all 0.5s ease;

  a {
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  &:hover {


    box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.75);
    -webkit-box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.75);
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

.taxi {
  border: #FFBF00 solid 1px;
  color: black;

  &:hover {

    background: #FFBF00;
    color: white;

  }

  &:active {
    background: #FFBF00;

  }
}

.order {
  border: #454154 solid 1px;
  color: #454154;

  &:hover {

    background: #454154;
    color: white;

  }

  &:active {
    background: #454154;

  }
}

.public {

  border: #ff540e solid 1px;
  color: #ff540e;

  &:hover {

    background: #ff540e;
    color: white;

  }

  &:active {
    background: #ff540e;

  }
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

