<script setup></script>
<template>
  <a-affix>

    <a-layout-footer>
      <a-row type="flex" justify="center">
        <a-col :xs="24" :md="18">
          <a-row class="bottom_menu d-flex">
            <a-col :xs="8" class="d-flex align-center direction-column">
              <div><b>Условия</b></div>
              <div>
                <div>Оферта</div>
                <div>Правила</div>
                <div>Оплата</div>
              </div>
            </a-col>
            <a-col :xs="8" class="d-flex align-center direction-column">
              <div><b>О проекте</b></div>

              <div>
                <div>Вопросы</div>
                <div>Поддержка</div>
                <div>Контакты</div>
              </div>
            </a-col>
            <a-col :xs="8" class="d-flex align-center direction-column">
              <div><b>Обучение</b></div>

              <div>
                <div>Создать поездку</div>
                <div>Регистрация</div>
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>

      <a-divider />
      <a-row type="flex" justify="center" class="mt-16">
        <a-col> <b>Сделано в Кубит</b> </a-col>
      </a-row>
    </a-layout-footer>
  </a-affix>
</template>
<style scoped>
.bottom_menu {
  font-size: clamp(12px, 2vw, 14px);
}
</style>
