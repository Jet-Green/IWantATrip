<script setup>
// import MadeWithLove from '../assets/images/madewithlove.svg'

</script>

<template>
  <a-affix>
    <a-layout-footer class="footer" >
      <!-- <a-divider /> -->
      <a-row type="flex" justify="center">
        <a-col :xs="24" :md="18">
       
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
          </a-row>
      
        </a-col>
      </a-row>

      <a-row type="flex" justify="center" class="mt-16">
        <a-col>
          <a href="https://qbit-club.com/" target="_blank" style="user-select: none;" aria-label="qbit">
            <img src="../assets/images/madewithlove.webp" alt="not found" style="height: 60px;">
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
.footer{
  background: #64bed8;
}
</style>
