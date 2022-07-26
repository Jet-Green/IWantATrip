<script setup></script>
<template>
  <a-layout-footer>
    <a-row type="flex" justify="center">
      <a-col :xs="24" :lg="16">
        <a-row type="flex" justify="space-between" style="margin-bottom: 16px">
          <a-col :xs="24" :lg="6">
            <a-row type="flex" justify="center">
              <a-col :xs="24" :lg="10">
                <div class="main">Оплата и документы</div>
                <div class="secondary">
                <div>Конфидециальность</div> 
                <div>Публичная оферта</div>
                <div>Правила сервиса</div>
                <div>Правила оплаты</div>
                </div>
              </a-col>
            </a-row>
          </a-col>
          <a-col :xs="24" :lg="6">
            <a-row type="flex" justify="center">
              <a-col :xs="24" :lg="9">
                <div class="main">О проекте</div>
                <div class="secondary">
                <div>Частые вопросы</div>
                <div>Тех. поддержка</div>
                <div>Контакты</div>
                </div>
              </a-col>
            </a-row>
          </a-col>
          <a-col :xs="24" :lg="6">
            <a-row type="flex" justify="center">
              <a-col :xs="24" :lg="9">
                <div class="main">Обучение</div>
                <div class="secondary">
                <div>Создать поездку</div>
                <div>Регистрация</div>
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row type="flex" justify="center">
          <a-col class="secondary">Сделано в Кубит</a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-layout-footer>
</template>
<style scoped>
.main {
  font-size: 20px;
}
.secondary {
  font-size: 12px;
}
</style>
