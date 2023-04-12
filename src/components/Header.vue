<script setup>
import { useRouter } from "vue-router";
import { ref,watch } from "vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useAuth } from "../stores/auth";

import TripCreatorReg from "./forms/TripCreatorReg.vue";
import LogoSvg from "../components/_explanation/LogoSvg.vue";

const user = useAuth();
let i = ref(null)
let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");
let router = useRouter();
let visibleDrawer = ref(false);
let visibleModal = ref(false);
let showCity = ref(null)
let isTripCreator = ref(false);
let visibleCreator = ref(false);
let value = ref("Reg");
let possibleLocations = ref([])
function dosmt(){

}
function showDrawer() {
  visibleDrawer.value = !visibleDrawer.value;
  console.log(i)
}
function toComponentFromMenu(routName) {
  router.isReady().then(() => {
    router.push({ name: routName });
  });
  visibleDrawer.value = false;
}
let changeVisibleCreator = () => {
  visibleCreator.value = !visibleCreator.value;
};
const bot = () => {
  window.location.href = "http://t.me/IWantATripBot";
};
const md = breakpoints.between('sm', 'md')
const lg = breakpoints.between('md', 'lg')
const xl = breakpoints.between('lg', 'xl')
const xxl = breakpoints.between('xl', '2xl')
const xxxl = breakpoints['2xl']
watch(showCity, async (newValue, oldValue) => {
    if (newValue.trim().length > 2 && newValue.length > oldValue.length) {
        var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

        var options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + import.meta.env.VITE_DADATA_TOKEN
            },
            body: JSON.stringify({
                query: newValue,
                count: 5,
                "from_bound": { "value": "city" },
                "to_bound": { "value": "settlement" }
            })
        }

        let res = await fetch(url, options)
        try {
            let suggestions = JSON.parse(await res.text()).suggestions
            possibleLocations.value = []
            for (let s of suggestions) {
                possibleLocations.value.push({
                        value: s.value,
                    }
                  )
            }
        } catch (error) {
            console.log(error);
        }
    }
    console.log(showCity,possibleLocations)
})
</script>

<template>
  <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <a-row type="flex" justify="space-between">
          <a-col :xs="20" :md="12" >
            <img
              src="../assets/images/logo.png"
              style="height: 90%; padding: 4px; margin-right: 32px"
              alt=""
              @click="toComponentFromMenu('Landing')"
            />
            <!-- <LogoSvg></LogoSvg> -->
            <a-popover placement="topLeft" trigger="click">
              <span class="mdi mdi-24px mdi-map-marker">
                 
               </span>
              <template #content>
                  <a-auto-complete v-model:value="showCity" :options="possibleLocations"  style="width: 200px" @search="dosmt"></a-auto-complete>
              </template>
            </a-popover>
            <span class="ml-8">{{ showCity }}</span>
          </a-col>
          <a-col v-if="!sm" :span="12" class="top_menu">
            <div @click="toComponentFromMenu('TripsPage')" class="route">найти</div>
            <div @click="toComponentFromMenu('CreateTripWithHelp')" class="route">
              заказать
            </div>
            <div @click="toComponentFromMenu('CreateTripNoHelp')" class="route">
              создать
            </div>
            <div @click="toComponentFromMenu('CompanionsPage')" class="route">
              попутчики
            </div>
            <span
              v-if="user.isAuth"
              class="mdi mdi-24px mdi-home"
              @click="toComponentFromMenu('Cabinet')"
              style="cursor: pointer"
              cancelText="отмена"
            >
            </span>
            <span
              v-if="!user.isAuth"
              class="mdi mdi-24px mdi-login"
              @click="toComponentFromMenu('RegForm')"
              style="cursor: pointer"
            >
            </span>
            <!-- <span @click="bot">
                      <img src="data:image/jpeg;base64,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"  style="height: 24px"/>
                    </span> -->
          </a-col>
          <a-col v-else>
            <span
              class="mdi mdi-24px mdi-menu"
              style="color: #245159; cursor: pointer"
              @click="showDrawer"
            ></span>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-drawer
      placement="right"
      :closable="false"
      :visible="visibleDrawer"
      @close="showDrawer"
      width="200"
    >
      <div @click="toComponentFromMenu('TripsPage')" class="route ma-8">найти тур</div>
      <div @click="toComponentFromMenu('CreateTripWithHelp')" class="route ma-8">
        заказать тур
      </div>
      <div @click="toComponentFromMenu('CreateTripNoHelp')" class="route ma-8">
        создать тур
      </div>
      <div @click="toComponentFromMenu('CompanionsPage')" class="route ma-8">
        попутчики
      </div>
      <div @click="toComponentFromMenu('Cabinet')" class="route ma-8">кабинет</div>
    </a-drawer>
  </a-layout-header>
</template>

<style lang="scss" scoped>
.ant-layout-header {
  padding: 0;

  .top_menu {
    display: flex;
    justify-content: space-around;
  }
}

.route {
  cursor: pointer;
  text-transform: uppercase;
}
</style>
