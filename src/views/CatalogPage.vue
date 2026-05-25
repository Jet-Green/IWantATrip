<script setup>
import { defineAsyncComponent } from 'vue'

const CatalogFilter = defineAsyncComponent(() =>
  import("../components/sections/CatalogFilter.vue")
)
const CatalogList = defineAsyncComponent(() =>
  import("../components/CatalogList.vue")
)
// import CatalogFilter from "../components/sections/CatalogFilter.vue";
import BackButton from "../components/BackButton.vue";
import { useRoute } from "vue-router";
// import CatalogList from "../components/CatalogList.vue";


const route = useRoute();

</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <h2>Каталог</h2>
       
      </a-col>
    </a-row>
    <CatalogFilter :search="route.query.search" />

    <CatalogList />
  </div>
</template>
