<script setup>
import BackButton from "../components/BackButton.vue";
</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :sm="12">
        <div>
          <h1>Контакты</h1>
          <p>ООО "Платформа Союз"</p>
          <p>ИНН 1837013960 /КПП 183701001</p>
          <p>ОГРН 1151832026631</p>
          <h3>Юр.адрес:</h3>
          <p>427629, Удмуртская Республика, город Глазов, Красногорский тракт, д. 3</p>
          <h3>Факт. адрес:</h3>
          <p>427628, Удмуртская Республика, город Глазов, пл.Свободы, 6/1, офис 3</p>
          <h3>эл.почта:</h3>
          <p>
            <a href="mailto:gorodaivesi@mail.ru" target="_blank" rel="noreferrer">gorodaivesi@mail.ru</a>
          </p>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
