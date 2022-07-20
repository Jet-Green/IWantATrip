<script setup>
import toSee from '../../assets/icons/to-see.svg'
import entertainment from '../../assets/icons/entertainment.svg'
import food from '../../assets/icons/food.svg'
import hotel from '../../assets/icons/hotel.svg'
import poster from '../../assets/icons/poster.svg'
import guide from '../../assets/icons/guide.svg'
import heart from '../../assets/icons/heart.svg'
import sport from '../../assets/icons/sport.svg'

let cards = [
  {
    title: 'Что посмотреть',
    icon: toSee
  },
  {
    title: 'Где поесть',
    icon: food
  },
  {
    title: 'Где остановиться',
    icon: hotel
  },
  {
    title: 'Афиша',
    icon: poster
  },
  {
    title: 'Экскурсии',
    icon: guide
  },
  {
    title: 'Развлечения',
    icon: entertainment
  },
  {
    title: 'Спорт и красота',
    icon: sport
  },
  {
    title: 'Отдых и здоровье',
    icon: heart
  }
]
</script>

<template>
  <a-row type="flex" justify="center" style="background-color: #F6F6F6">
    <a-col :xs="22" :lg="16">
      <a-row>
        <a-col>
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              <a-typography-title>
                Гид по Глазову
                <span class="mdi mdi-chevron-down"></span>
              </a-typography-title>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  Ижевск
                </a-menu-item>
                <a-menu-item>
                  Воткинск
                </a-menu-item>
                <a-menu-item>
                  Игра
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-col>
      </a-row>
      <a-row type="flex" justify="space-between">
        <a-col v-for="(card, index) in cards" :key="index" :xs="11" :lg="5" class="mb-16">
          <a-tooltip placement="top" color="#3DAFF5">
            <template #title>
              Нажмите, чтобы узнать больше
            </template>
            <div class="card">
              <img :src="card.icon" alt="icon" class="icon">
              <a-typography-title :level="5" style="margin: 0 16px 0 0">
                {{ card.title }}
              </a-typography-title>
            </div>
          </a-tooltip>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style scoped lang="scss">
.icon {
  height: 70px;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 0 10px #D9D9D9;
  margin: 16px;
}

.card {
  cursor: pointer;
  background-color: white;
  border-radius: 20px;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
