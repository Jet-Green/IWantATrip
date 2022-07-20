<script setup></script>
<template>
  <a-row type="flex" justify="center">
    <a-col :lg="16" :xs="22">
      <a-row class="select-container">
        <a-col :md="5" :xs="24">
          <a-select
            style="width: 100%"
            placeholder="Куда едем"
            v-model:value="where"
            @focus="focusOnWhere"
            @change="handleChangeOnWhere"
            :bordered="false"
            size="large"
          >
            <a-select-option value="1"> Туда </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="5" :xs="24">
          <a-select
            style="width: 100%"
            placeholder="Как едем"
            v-model:value="how"
            @focus="focusOnWhere"
            @change="handleChangeOnWhere"
            :bordered="false"
            size="large"
          >
            <a-select-option value="1"> Так </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="5" :xs="24">
          <a-select
            style="width: 100%"
            placeholder="На сколько"
            v-model:value="time"
            @focus="focusOnWhere"
            @change="handleChangeOnWhere"
            :bordered="false"
            size="large"
          >
            <a-select-option value="1"> На столько </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="5" :xs="24">
          <a-select
            style="width: 100%"
            placeholder="На сколько"
            v-model:value="time"
            @focus="focusOnWhere"
            @change="handleChangeOnWhere"
            :bordered="false"
            size="large"
          >
            <a-select-option value="1"> На столько </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="4" :xs="24">
          <a-button style="height: 100%; width: 100%; border-radius: 15px" type="primary">
            Найти
          </a-button>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>
<style scoped>
.select-container {
  background-color: #d9d9d9;
  border-radius: 15px;
  overflow: hidden;
  margin: 32px 0 32px 0
}
</style>
