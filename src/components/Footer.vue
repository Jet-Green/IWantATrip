<script setup>
// import MadeWithLove from '../assets/images/madewithlove.svg'

</script>

<template>
  <a-affix>
    <a-layout-footer class="footer">
      <a-row type="flex" justify="center">
        <a-col :xs="24" :md="18">

          <a-row class="footer-links d-flex space-around">
            <a-col class="d-flex align-center">
              <router-link to="/privacy-policy" style="color: white; font-size: 13px;">
                Политика обработки персональных данных
              </router-link>
            </a-col>
            <a-col class="d-flex align-center">
              <router-link to="/personal-data-rules" style="color: white; font-size: 13px;">
                Порядок обработки и защиты персональных данных
              </router-link>
            </a-col>
          </a-row>

          <a-row class="bottom_menu d-flex space-around">
            <a-col class="d-flex align-center direction-column">
              <router-link to="/documents">
                <b style="color: white"> Документы </b>
              </router-link>
            </a-col>

            <a-col class="d-flex align-center direction-column">
              <router-link to="/contacts">
                <b style="color: white"> Контакты </b>
              </router-link>
            </a-col>
            <a-col class="d-flex align-center direction-column">
              <a href="https://promo.plpo.ru" target="_blank">
                <b style="color: white"> Партнерам </b>
              </a>
            </a-col>
          </a-row>

        </a-col>
      </a-row>

      <a-row type="flex" justify="center" class="mt-16">
        <a-col>
          <a href="https://qbit-club.com/" target="_blank" style="user-select: none;" aria-label="qbit">
            <img src="../assets/images/madewithlove.webp" alt="not found" style="height: 60px;">
          </a>
        </a-col>
      </a-row>
    </a-layout-footer>
  </a-affix>
</template>

<style scoped>
.footer-links {
  font-size: clamp(11px, 1.5vw, 14px);
  margin-bottom: 8px;
  gap: 16px;
}

.bottom_menu {
  font-weight: 900;
  font-size: clamp(12px, 2vw, 18px);
  margin-bottom: 20px;
}

.footer {
  background: #64bed8;
}
</style>
