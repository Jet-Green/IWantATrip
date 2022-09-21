<script setup>
import { ref, reactive, watch } from "vue";
import { useElementBounding } from "@vueuse/core";
import { useRouter } from "vue-router";

const marker = ref(null);
const questions = ref([]);
const answers = ref([]);
const buttonText = ref(null);
const buttonRoute = ref(null);

const { y } = useElementBounding(marker);

let router = useRouter();

let youCanDo = reactive([
  {
    question: "Найти </br> тур",
    answer:
      "<span>воспользуйтесь фильтром <br> выберите из вариантов <br> отдыхайте там, где выбрали</span>",
    description: "найти!",
    startActive: 800,
    finishActive: -150,
    route: "/trips",
  },
  {
    question: "Заказать </br> тур",
    answer:
      "<span>заполните простую форму <br> мы поможем вам с выбором <br>у вас идеальный отдых</span>",
    description: "заказать!",
    startActive: -150,
    finishActive: -450,
    route: { name: "CreateTripWithHelp" },
  },
  {
    question: "Создать </br> тур",
    answer:
      "<span>ничего не нашли? <br> создайте тур сами <br> ваш тур - ваши правила</span>",
    description: "создать!",
    startActive: -450,
    finishActive: -750,
    route: { name: "CreateTripNoHelp" },
  },
  {
    question: "Найти </br> попутчика",
    answer:
      "<span> присоеденись к другим <br> пригласи поехать с вами <br> вместе всегда веселей</span>",
    description: "вместе!",
    startActive: -750,
    finishActive: -2000,
    route: "/companions",
  },
]);

function routeTo(buttonRoute) {
  router.push(buttonRoute);
}

watch(y, (newY) => {
  for (let i = 0; i < youCanDo.length; i++) {
    if (newY < youCanDo[i].startActive && newY >= youCanDo[i].finishActive) {
      questions.value[i].classList.add("active-todo-element");
      answers.value[i].classList.add("animate-answer");
      buttonText.value = youCanDo[i].description;
      buttonRoute.value = youCanDo[i].route;
    } else {
      questions.value[i].classList.remove("active-todo-element");
      answers.value[i].classList.remove("animate-answer");
    }
  }
});
</script>
<template>
  <a-row type="flex" justify="center" class="pt-32">
    <a-col :xs="23" :md="18" :lg="16">
      <a-row>
        <!-- ** элемент отслеживание которого влияет на поведение компоненты -->
        <div ref="marker"></div>
        <a-col :xs="8" :md="12">
          <!-- TODO: расчитывать высоту этого элемента исходя их высоты экрана vueuse  -->
          <div
            style="height: 600px"
            :class="{
              todo: y > 150,
              'fix-todo': y <= 150 && y > -900,
              'absolute-todo': y <= -900,
            }"
          >
            <div
              v-for="(el, index) in youCanDo"
              :key="index"
              ref="questions"
              class="todo-element"
              v-html="el.question"
              style="z-index: 1"
              @click="routeTo(el.route)"
            ></div>

            <a-button
              type="primary"
              class="lets_go_btn ma-16"
              size="large"
              @click="routeTo(buttonRoute)"
            >
              {{ buttonText }}
            </a-button>
          </div>
        </a-col>
        <a-col :xs="16" :md="12">
          <div class="todo-answer">
            <div
              v-for="(el, index) in youCanDo"
              :key="index"
              class="answer"
              ref="answers"
            >
              <div
                class="answer-text"
                v-html="el.answer"
                @click="routeTo(el.route)"
              ></div>
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

.todo-answer {
  .answer {
    opacity: 0;
    transform:scale(0.1);
    // transform: translateY(10px);
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;

    transition: all 1s ease;
    .answer-text {
      color: white;
      text-transform: uppercase;
      font-weight: 500;
      text-align: center;
      font-size: clamp(10px, 2.5vw, 18px);
      line-height: clamp(24px, 2.5vw, 50px);
      background: #27728b;
      width: 75%;
      aspect-ratio:1;
      border-radius: 50%;
      display: flex;
    justify-content: center;
    align-items: center;
    }
  }

  .animate-answer {
    opacity: 1;
    transform:scale(1);
    // transform: translateY(0);
    transition: all 1s ease;
  }
}

.todo-element {
  font-family: "Montserrat", sans-serif;
  font-size: clamp(18px, 3.5vw, 48px);
  line-height: 48px;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.5);

  transition: all 1s ease;
  text-transform: uppercase;
  -webkit-transform: translateZ(0) scale(1);
  cursor: pointer;
}

.active-todo-element {
  color: #27728b;
  transform: scale(1.03);
  transition: all 1s ease;
  -webkit-transform: translateZ(0) scale(1.03);
}
</style>
