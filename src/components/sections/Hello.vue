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
          <a-button type="primary" class="lets_go_btn" >
            Заказать тур!
          </a-button>
        </router-link>
      </a-col>
      <a-col :md="6">
        <router-link to="/create-no-help">
          <a-button type="primary" class="lets_go_btn" >
            Создать тур!
          </a-button>
        </router-link>
      </a-col>
      <a-col :md="6">
        <router-link to="/companions">
          <a-button type="primary" class="lets_go_btn" >
            Найти попутчиков!
          </a-button>
        </router-link>
      </a-col>
    </a-row>
  </div>
</template>
