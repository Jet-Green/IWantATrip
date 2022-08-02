<script setup>
import { onMounted, ref, reactive, watch } from "vue";
import { useElementBounding } from "@vueuse/core";

const marker = ref(null);
const questions = ref([]);
const answers = ref([]);

const { y } = useElementBounding(marker);

let youCanDo = reactive([
  {
    question: "Найти </br> тур",
    answer: "текст для найти тур",
    description: "пояснения для найти тур",
    startActive: 800,
    finishActive: -150,
  },
  {
    question: "Заказать </br> тур",
    answer: "текст для заказать тур",
    description: "пояснения для заказать тур",
    startActive: -150,
    finishActive: -450,
  },
  {
    question: "Создать </br> тур",
    answer: "текст для создать тур",
    description: "пояснения для создать тур",
    startActive: -450,
    finishActive: -750,
  },
  {
    question: "Найти </br> попутчика",
    answer: "текст для найти попутчика",
    description: "пояснения для найти попутчика",
    startActive: -750,
    finishActive: -2000,
  },
]);
const description = ref(youCanDo[0].description);
watch(y, (newY) => {
  for (let i = 0; i < youCanDo.length; i++) {
    if (newY < youCanDo[i].startActive && newY >= youCanDo[i].finishActive) {
      questions.value[i].classList.add("active-todo-element");
      answers.value[i].classList.add("animate-answer");
      description.value.innerHTML = youCanDo[i].description;
    } else {
      questions.value[i].classList.remove("active-todo-element");
      answers.value[i].classList.remove("animate-answer");
    }
  }
});

onMounted(() => {});
</script>
<template>
  <a-row type="flex" justify="center" class="pt-32">
    <a-col :xs="18" :lg="14">
      <a-row>
        <!-- ** элемент отслеживание которого влияет на поведение компоненты -->
        <div ref="marker"></div>
        <a-col style="width: 50%">
          <!-- TODO: расчитывать высоту этого элемента исходя их высоты экрана vueuse  -->
          <div
            style="height: 600px"
            :class="{
              todo: y > 150,
              'fix-todo': y <= 150 && y > -1000,
              'absolute-todo': y <= -1000,
            }"
          >
            <div
              v-for="(el, index) in youCanDo"
              :key="index"
              ref="questions"
              class="todo-element"
              v-html="el.question"
            ></div>
            <div ref="description">
              {{ questions }}
              тут описание к вопросу для заполнения пустоты
            </div>
          </div>
        </a-col>
        <a-col style="width: 50%">
          <div class="todo-answer">
            <div
              v-for="(el, index) in youCanDo"
              :key="index"
              class="answer"
              ref="answers"
            >
              {{ el.answer }}
            </div>
          </div>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>



<style lang="scss" scoped>
.todo {
  transition: all 1s ease;
}
.fix-todo {
  transition: all 1s ease;
  position: fixed;
  top: 150px;
}
.absolute-todo {
  position: absolute;
  bottom: -50px;
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
  font-family: "Montserrat", sans-serif;
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