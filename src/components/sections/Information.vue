<script setup>
import { onMounted, ref, reactive } from "vue";
import { useElementBounding } from "@vueuse/core";
const el = ref(null);
const { x, y, top, right, bottom, left, width, height } =
  useElementBounding(el);

onMounted(() => {});
</script>
<template>
  <a-row type="flex" justify="center">
    <a-col :xs="18" :lg="14">
      <a-row>
        <a-col ref="el" style="width: 50%">
          <div
            style="height: 600px"
            :class="{
              todo: y > 150,
              'animate-todo': y <= 150 && y > -900,
              'absolute-todo': y <= -900,
            }"
          >
            <div
              class="todo-element"
              :class="{ 'active-todo-element': y < 350 && y >= -150 }"
            >
              Найти <br />
              тур
            </div>
            <div
              class="todo-element"
              :class="{ 'active-todo-element': y < -150 && y >= -450 }"
            >
              Заказать <br />
              тур
            </div>
            <div
              class="todo-element"
              :class="{ 'active-todo-element': y < -450 && y >= -750 }"
            >
              Создать <br />
              тур
            </div>
            <div
              class="todo-element"
              :class="{ 'active-todo-element': y < -750 }"
            >
              Найти <br />
              попутчика
            </div>
          </div>
        </a-col>
        <a-col style="width: 50%">
          <div class="todo-answer">
            <div
              class="answer"
              :class="{ 'animate-answer': y < 350 && y >= -150 }"
            >
              Удобная система фильтрации подберет варианты именно для вас
            </div>
            <div
              class="answer"
              :class="{ 'animate-answer': y < -150 && y >= -450 }"
            >
              Быстрая форма
            </div>
            <div
              class="answer"
              :class="{ 'animate-answer': y < -450 && y >= -750 }"
            >
              Удобная система фильтрации подберет варианты именно для вас
            </div>
            <div class="answer" :class="{ 'animate-answer': y < -750 }">
              Оставьте заявку на поиск попутчика <br />
              или сами станьте попутчиком
            </div>
          </div>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>



<style lang="scss" scoped>
.todo {
  transform: translateY(150px);
  transition: all 1s ease;
  
}
.animate-todo {

  transform: translateY(150px);
  transition: all 1s ease;
  position: fixed;
  top: 150px;
}
.absolute-todo {
  transform: translateY(150px);
  position: absolute;
  bottom: 70px;
}

.answer {
  opacity: 0;
  transform: translateY(100px);
  height: 400px;
  margin: 20px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 1s ease;
}
.todo-answer {
  .animate-answer {
    opacity: 1;
    transform: translateY(0);
    transition: all 1s ease;
  }
}
.todo-element {
  // font-family: "Montserrat", sans-serif;
  font-size: 48px;
  line-height: 48px;
  font-weight: 900;
  color: black;
  opacity: 0.5;
  text-transform: uppercase;

 
}
.active-todo-element {
  opacity: 1;
  color: #245159;
  transition: all 1s ease;
}
</style>