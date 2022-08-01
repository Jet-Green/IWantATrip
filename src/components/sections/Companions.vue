<script setup>
import CompanionCard from '../cards/CompanionCard.vue'
</script>
<template>
  <a-row type="flex" justify="center">
    <a-col :lg="16" :xs="22" class="cards">
      <div v-for="item in 5">
        <CompanionCard/>
      </div>
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
.cards{
    display: flex;
    flex-direction: row;
}
</style>