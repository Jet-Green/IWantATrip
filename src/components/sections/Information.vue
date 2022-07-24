<script setup>
import { onMounted, ref, reactive, watch } from "vue";
import { useElementBounding } from "@vueuse/core";

const marker = ref(null);
const question0 = ref(null);
const question1 = ref(null);
const question2 = ref(null);
const question3 = ref(null);
const answer0 = ref(null);
const answer1 = ref(null);
const answer2 = ref(null);
const answer3 = ref(null);

const { x, y, top, right, bottom, left, width, height } =
  useElementBounding(marker);

let youCanDo = reactive([
  {
    ref: "question0",
    refForAnswer: "answer0",
    question: "Найти </br> тур",
    answer: "текст для найти тур",
    description: "пояснения для найти тур",
    startActive: 350,
    finishActive: -150,
  },
  {
    ref: "question1",
    refForAnswer: "answer1",
    question: "Заказать </br> тур",
    answer: "текст для заказать тур",
    description: "пояснения для заказать тур",
    startActive: -150,
    finishActive: -450,
  },
  {
    ref: "question2",
    refForAnswer: "answer2",
    question: "Создать </br> тур",
    answer: "текст для создать тур",
    description: "пояснения для создать тур",
    startActive: -450,
    finishActive: -750,
  },
  {
    ref: "question3",
    refForAnswer: "answer3",
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
    let elQuestionRef, elAnswerRef;
    switch (i) {
      case 0:
        elQuestionRef = question0;
        elAnswerRef = answer0;
        break;
      case 1:
        elQuestionRef = question1;
        elAnswerRef = answer1;
        break;
      case 2:
        elQuestionRef = question2;
        elAnswerRef = answer2;
        break;
      case 3:
        elQuestionRef = question3;
        elAnswerRef = answer3;
        break;
    }

    if (newY < youCanDo[i].startActive && newY >= youCanDo[i].finishActive) {
      elAnswerRef.value[0].classList.add("animate-answer");
      elQuestionRef.value[0].classList.add("active-todo-element");
      description.value.innerHTML = youCanDo[i].description;
    } else {
      elQuestionRef.value[0].classList.remove("active-todo-element");
      elAnswerRef.value[0].classList.remove("animate-answer");
    }
  }
});

onMounted(() => {});
</script>
<template>
  <a-row type="flex" justify="center">
    <a-col :xs="18" :lg="14">
      <a-row>
        <!-- ** элемент отслеживание которого влияет на поведение компоненты -->
        <a-col ref="marker" style="width: 50%">
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
              :ref="el.ref"
              class="todo-element"
              v-html="el.question"
            ></div>
            <div ref="description">
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
              :ref="el.refForAnswer"
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