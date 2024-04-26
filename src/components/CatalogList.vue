<script setup>
import { ref, onMounted } from "vue";
import { useTrips } from "../stores/trips";
import CatalogListCard from "../components/cards/CatalogListCard.vue";
import BackButton from "../components/BackButton.vue";
import CatalogFilter from "../components/sections/CatalogFilter.vue";
import { useRoute } from "vue-router";

const route = useRoute();
let tripStore = useTrips()
let isRefreshing = ref(true)

let handleScroll = async () => {
    isRefreshing.value = true
    let triggerHeight =
        wrapper.value.scrollTop + wrapper.value.offsetHeight + 5

    if (triggerHeight > wrapper.value.offsetHeight) {
        triggerHeight = wrapper.value.scrollHeight
    }

    if (triggerHeight == wrapper.value.scrollHeight) {
        await tripStore.fetchCatalogTrips(
            tripStore?.tripFilter.query,
            tripStore?.tripFilter.type
        )
        isRefreshing.value = false
    }

}

const wrapper = ref(null)

onMounted(async () => {
    if (route.hash) {
        let id = route.hash.slice(1)
        document.getElementById(id)?.scrollIntoView()
    }
    wrapper.value.addEventListener("scroll", handleScroll);
    if (tripStore.catalog.length == 0) {
        await tripStore.fetchCatalogTrips()
        isRefreshing.value = false
    }
});
</script>
<template>
    <div>
        <BackButton />
        <div class="wrapper" ref="wrapper">
            <a-row type="flex" justify="center">
                <a-col :xs="22" :lg="16">
                    <h2>Каталог туров</h2>
                    <p><i>можно организовать в удобные даты</i> </p>
                </a-col>
            </a-row>
            <CatalogFilter :search="route.query.search" />
            <a-row class="d-flex justify-center">
                <a-col :xs="22" :lg="16">
                    <a-row :gutter="[16, 18]" class="d-flex justify-center mt-8 pb-24"
                        v-if="tripStore.catalog.length > 0">
                        <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="trip in tripStore.catalog" :key="trip.index">
                            <CatalogListCard :trip="trip" />
                        </a-col>
                    </a-row>
                    <a-row v-else-if="isRefreshing">
                        <a-col :span="24" class="d-flex justify-center">
                            <img src="../assets/images/founddog.webp" alt="" style="height: 150px;">
                        </a-col>
                    </a-row>
                    <a-row v-else>
                        <a-col :span="24" class="d-flex justify-center">
                            <div style="display: flex; flex-direction: column;">
                                <div class="d-flex justify-center">
                                    <img src="../assets/images/notfound.jpg" alt="" style="height: 150px;">
                                </div>
                                <h3>я ничего не нашёл</h3>
                            </div>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.wrapper {

    height: 85vh;
    overflow: auto;

    &::-webkit-scrollbar {
        display: none;
    }
}
</style>
