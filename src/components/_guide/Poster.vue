<script setup>
import BackButton from "../BackButton.vue";
import { onMounted, ref, reactive, watch } from "vue";
import axios from "axios";
import { useLocations } from "../../stores/locations";


const locationStore = useLocations();

let posters = ref([])
let posterTypes = ref([])


const backRoute = { name: 'Landing', hash: '#guide' };
let query = ref({
  eventLocation: '',
  eventType: []
})

let selectType = ref([]);

function goToPlpo(poster_id) {
  window.open(`https://plpo.ru/post?_id=${poster_id}`)
}

watch(selectType, () => {
  let filtered = posterTypes.value.filter((item, index) =>
    selectType.value[index]
  )
  query.value.eventType = filtered.map((item) => item.name)
  getPosters()
}, { deep: true }


)

watch(() => locationStore.location, () => {
  query.value.eventLocation = locationStore?.location.name
  getPosters()
})

let getPosters = async () => {
  let plpoPosters = await axios.post('https://api.plpo.ru/api/get-all', { query: query.value }, {
    headers: {
      "Authorization": `Bearer ${123}`
    }
  })
  posters.value = plpoPosters.data
  
}

onMounted(async () => {
  let getTypes = await axios.get('https://api.plpo.ru/api/get-posters-types', {
    headers: {
      "Authorization": `Bearer ${123}`
    }
  })
  posterTypes.value = getTypes.data.eventTypes

  let setSelected = Array(posterTypes.value.length).fill(false);
  selectType.value = setSelected
  query.value.eventLocation = locationStore?.location.name
  await getPosters()
})

</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />
    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="16">
        <h2 class="d-flex space-between">
          Афиши
          <a href="https://plpo.ru" target="_blank">
            <img src="../../assets/plpo.webp" alt="" srcset="" style="max-height: 50px;"></a>
        </h2>
      </a-col>
    </a-row>
   
        <!-- <iframe title="Афиши" style="width: 100%; height:90dvh; border: none" src="https://plpo.ru/frame/frame-posters">
        </iframe> -->
 

    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="16">
        <a-row type="flex" justify="center">
          <a-col>
            <a-space :size="[0, 8]" wrap>
              <a-checkable-tag v-for="(type, index) in posterTypes" :key="type" v-model:checked="selectType[index]">
                {{ type.name }}
              </a-checkable-tag>
            </a-space>
          </a-col>

        </a-row>


        <a-row type="flex" justify="center">
          <a-col span="12" :md="6" v-for="poster in posters">
            <a-card class="ma-8" style="cursor:pointer">
              <template #cover>
                <img alt="example" :src="poster.image" @click="goToPlpo(poster._id)"/>
              </template>
            </a-card>
          </a-col>
        </a-row>



      </a-col>
    </a-row>
  </div>
</template>
