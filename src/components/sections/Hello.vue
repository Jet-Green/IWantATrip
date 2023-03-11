<script setup></script>

<template>
  <div>
    <a-row>
      <a-col :md="6">
        <router-link to="/trips">
          <div> 
          Найти тур
          </div>
        </router-link>
      </a-col>
      <a-col :md="6">
        <router-link to="/create-with-help">
          <a-button type="primary" class="lets_go_btn" size="large">
            Заказать тур!
          </a-button>
        </router-link>
      </a-col>
      <a-col :md="6">
        <router-link to="/create-no-help">
          <a-button type="primary" class="lets_go_btn" size="large">
            Создать тур!
          </a-button>
        </router-link>
      </a-col>
      <a-col :md="6">
        <router-link to="/companions">
          <a-button type="primary" class="lets_go_btn" size="large">
            Найти попутчиков!
          </a-button>
        </router-link>
      </a-col>
    </a-row>
  </div>
</template>
