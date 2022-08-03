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

const { y } = useElementBounding(marker);

let youCanDo = reactive([
  {
    refQuestion: question0,
    refAnswer: answer0,
    linkForQuestion: "question0",
    linkForAnswer: "answer0",
    question: "Найти </br> тур",
    answer: "текст для найти тур",
    description: "пояснения для найти тур",
    startActive: 800,
    finishActive: -150,
  },
  {
    refQuestion: question1,
    refAnswer: answer1,
    linkForQuestion: "question1",
    linkForAnswer: "answer1",
    question: "Заказать </br> тур",
    answer: "текст для заказать тур",
    description: "пояснения для заказать тур",
    startActive: -150,
    finishActive: -450,
  },
  {
    refQuestion: question2,
    refAnswer: answer2,
    linkForQuestion: "question2",
    linkForAnswer: "answer2",
    question: "Создать </br> тур",
    answer: "текст для создать тур",
    description: "пояснения для создать тур",
    startActive: -450,
    finishActive: -750,
  },
  {
    refQuestion: question3,
    refAnswer: answer3,
    linkForQuestion: "question3",
    linkForAnswer: "answer3",
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
      youCanDo[i].refQuestion[0].classList.add("active-todo-element");
      youCanDo[i].refAnswer[0].classList.add("animate-answer");
      description.value.innerHTML = youCanDo[i].description;
    } else {
      youCanDo[i].refQuestion[0].classList.remove("active-todo-element");
      youCanDo[i].refAnswer[0].classList.remove("animate-answer");
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
        <a-col  style="width: 50%">
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
              :ref="el.linkForQuestion"
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
              :ref="el.linkForAnswer"
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