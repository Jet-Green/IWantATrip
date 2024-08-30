<script setup>
// import MadeWithLove from '../assets/images/madewithlove.svg'

</script>

<template>
  <a-affix>
    <a-layout-footer>
      <!-- <a-divider /> -->
      <a-row type="flex" justify="center">
        <a-col :xs="24" :md="18">
          <a-row class="bottom_menu d-flex space-around">
            <a-col class="d-flex align-center direction-column">
              <router-link to="/documents">
                <b> Документы </b>
              </router-link>
            </a-col>

            <a-col class="d-flex align-center direction-column">
              <router-link to="/contacts">
                <b> Контакты </b>
              </router-link>
            </a-col>
            <!-- <a-col :xs="8" class="d-flex align-center direction-column">
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
            </a-col> -->
          </a-row>
        </a-col>
      </a-row>

      <a-row type="flex" justify="center" class="mt-16">
        <a-col>
          <a href="https://qbit-club.com/" target="_blank" style="user-select: none;">
            <img src="../assets/images/madewithlove.webp" style="height: 60px;">
            <!-- <b> Сделано в Кубит </b> -->
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
