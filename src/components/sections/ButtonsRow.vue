<script setup>
import { useRouter } from "vue-router";
import { useAuth } from "../../stores/auth";

const router = useRouter();
const user = useAuth();

function routeTo(buttonRoute) {

  router.push(buttonRoute);

}
</script>
<template>
  <a-row class="justify-center ma-16 buttons">
    <a-col :xs="24" :md="16">
      <a-row class="d-flex space-around align-center">



        <a-button type="primary" shape="round" class="ma-4 order" @click="routeTo('/create-with-help')">

          Заказать
        </a-button>
        <!-- <a-button type="primary" shape="round" class="ma-4 order" @click="routeTo('/catalog')">

          Из каталога
        </a-button> -->
        <a-button type="primary" shape="round" class="ma-4 find " @click="routeTo('/trips')">

          Найти
        </a-button>



        <!-- <div>
          <a href="#guide" style="width: 100%; height: 100%"> <a-button type="primary" shape="round"
              class="city-guide mа-4" @click="routeTo('/companions')">

              По городу
            </a-button> </a>
        </div> -->

        <a-button type="primary" shape="round" class="mа-4 companions" @click="routeTo('/companions')">
          Попутчики
        </a-button>
      


        <!-- <a-button type="primary" shape="round" class="ma-4 create" @click="routeTo('/create-no-help')">

          Создать
        </a-button> -->

      </a-row>
    </a-col>
  </a-row>
</template>

<style lang="scss" scoped>
.create {
  background: linear-gradient(rgb(32, 95, 121), #227597);
}

.order {
  background: linear-gradient(rgb(52, 49, 62), rgb(69, 65, 84));
}

.find {
  background: linear-gradient(rgb(252, 79, 6), #ff540e);
}

.city-guide {
  background: linear-gradient(rgb(59, 24, 25), rgb(83, 30, 33));
}

.companions {
  background: linear-gradient(rgb(91, 109, 35), rgb(111, 133, 43));
}
</style>
