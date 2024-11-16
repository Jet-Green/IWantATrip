<script setup>
import { ref, onMounted } from 'vue'
import BackButton from "../components/BackButton.vue"
import PlaceCard from "../components/cards/PlaceCard.vue"
import { useRoute } from "vue-router";
import { usePlaces } from "../stores/place"

const placeStore = usePlaces()
const route = useRoute();

const _id = route.query._id;
let place = ref()

onMounted(async () => {
  if (_id) {
   placeStore.getById(_id).then((res)=> place.value = res.data)
     
  }
})
</script>
<template>
  <div style="overflow-x: hidden">
    <BackButton />
    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16">
        <PlaceCard :place="place" :open = true style="margin-bottom: 32px;" />
      </a-col>
    </a-row>
  </div>
</template>
