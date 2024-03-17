<script setup>
import MadeWithLove from '../assets/images/madewithlove.svg'

</script>

<template>
  <a-affix>
    <a-layout-footer>
      <!-- <a-divider /> -->
      <a-row type="flex" justify="center">
        <a-col :xs="24" :md="18">
          <a-row class="bottom_menu d-flex">
            <a-col :xs="8" class="d-flex align-center direction-column">
              <div>
                <a href="https://doc.gorodaivesi.ru/privacy/main.html" target="_blank"><b>Документы</b> </a>
              </div>
              <div>
                <div>
                  <a href="https://doc.gorodaivesi.ru/privacy/oferta.html" target="_blank">Оферта</a>
                </div>

                <div>
                  <a href="https://doc.gorodaivesi.ru/privacy/agentDocs.html" target="_blank">Агентский договор</a>
                </div>
                <div>
                  <a href="https://doc.gorodaivesi.ru/privacy/agreement.html" target="_blank">Согласие на обработку
                    персональных данных</a>
                </div>
                <div>
                  <a href="https://doc.gorodaivesi.ru/privacy/agentDocs.html">Агентский договор</a>
                </div>
              </div>
            </a-col>
            <a-col :xs="8" class="d-flex align-center direction-column">
              <div>
                <a href="https://doc.gorodaivesi.ru" target="_blank"><b>О проекте</b> </a>
              </div>

              <div>
                <div>
                  <a href="https://doc.gorodaivesi.ru/questions.html" target="_blank">Вопросы</a>
                </div>
                <div>
                  <a href="https://doc.gorodaivesi.ru/support.html" target="_blank">Поддержка</a>
                </div>
                <!-- ! -->
                <router-link to="/contacts">
                  <div> Контакты </div>
                </router-link>

                <!-- ! -->
              </div>
            </a-col>
            <a-col :xs="8" class="d-flex align-center direction-column">
              <div>
                <a href="https://doc.gorodaivesi.ru/education/main.html" target="_blank"><b>Обучение</b></a>
              </div>

              <div>
                <div>
                  <a href="https://doc.gorodaivesi.ru/education/create-trip.html" target="_blank">Создать поездку</a>
                </div>
                <div>
                  <a href="https://doc.gorodaivesi.ru/education/reg.html" target="_blank">Регистрация</a>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>

      <a-row type="flex" justify="center" class="mt-16">
        <a-col>
          <a href="https://qbit-club.com/" target="_blank">
            <!-- <img :src="MadeWithLove" style="height: 40px; user-select: none;"> -->
            <b> Сделано в Кубит </b>
          </a>
        </a-col>
      </a-row>
    </a-layout-footer>
  </a-affix>
</template>

<style scoped>
.bottom_menu {
  font-size: clamp(12px, 2vw, 14px);
}
</style>
