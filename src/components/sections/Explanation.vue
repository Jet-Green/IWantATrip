<script setup>



</script>
<template>
  <a-row style="width: 100%; display: flex; justify-content: center">
    <a-col style="display: flex; justify-content: center">
      <a-typography style="font-size: 36px">
        Удобная платформа для путешествий!
      </a-typography>
    </a-col>
  </a-row>
  <a-row style="width: 100%; display: flex; justify-content: center">
    <a-col style="justify-content: center" v-for="i in 4">
    {{i}}
      <a-col style="justify-content: center; margin: 0 15px 0 15px">
        <a-image
          style="border-radius: 20px"
          :width="200"
          src="https://themiscochat.com/wp-content/uploads/2022/04/couple-relaxing-beach-vacation.webp "
        />
      </a-col>
      <a-col style="justify-content: center; margin: 0 15px 0 15px">
        <a-typography style="font-size: 16px"> Создайте свой тур </a-typography>
      </a-col>
    </a-col>
    <!-- <a-col style="justify-content: center">
      <a-col style="justify-content: center; margin: 0 15px 0 15px">
        <a-image
          style="border-radius: 20px"
          :width="200"
          src="https://s1.1zoom.ru/big0/234/Sea_Sky_Beach_Sunlounger_Sand_Rest_580068_1280x853.jpg "
        />
      </a-col>
      <a-col style="justify-content: center; margin: 0 15px 0 15px">
        <a-typography style="font-size: 16px"> Выберите готовый тур </a-typography>
      </a-col>
    </a-col> -->
   
  </a-row>
</template>
