<script setup>
import { reactive, watch, onMounted } from "vue";
import { useAuth } from '../../stores/auth'
const userStore = useAuth();
const userTypes = [
  {
    value: "phys",
    label: "Физическое лицо",
  },
  {
    value: "entrepreneur",
    label: "Индивидуальный предприниматель",
  },
  {
    value: "company",
    label: "Юридическое лицо",
  },
];
const emit = defineEmits(['fullInfo'])

let fullInfo = reactive({
  type: "phys",
  creatorsType: "author",
  fullname: null,
  phone: null,
  govermentRegNumber: null,
  companyName: null,
});
watch(fullInfo, (newValue) => {
  emit('fullInfo', newValue)
})
onMounted(() => {
  if (userStore.user.fullinfo) {
    userStore.user.fullinfo.fullname ? fullInfo.fullname = userStore.user.fullinfo.fullname : fullInfo.fullname = "";
    userStore.user.fullinfo.phone ? fullInfo.phone = userStore.user.fullinfo.phone : fullInfo.phone = "";
    userStore.user.fullinfo.type ? fullInfo.type = userStore.user.fullinfo.type : fullInfo.type = "phys";
    userStore.user.fullinfo.creatorsType ? fullInfo.creatorsType = userStore.user.fullinfo.creatorsType : fullInfo.creatorsType = "author";
    userStore.user.fullinfo.govermentRegNumber ? fullInfo.govermentRegNumber = userStore.user.fullinfo.govermentRegNumber : fullInfo.govermentRegNumber = "";
    userStore.user.fullinfo.companyName ? fullInfo.companyName = userStore.user.fullinfo.companyName : fullInfo.companyName = "";

  }
});
</script>
<template>
  <h2>О вас</h2>
  <a-row :gutter="[16, 16]">
    <a-col :span="12">
      Вы
      <a-select v-model:value="fullInfo.type" style="width: 100%" :options="userTypes">
      </a-select>
    </a-col>

    <a-col :span="12" v-if="fullInfo.type">
      Тип организатора
      <div>
        <a-radio-group v-model:value="fullInfo.creatorsType">
          <a-radio-button value="author">Автор тура</a-radio-button>
          <a-radio-button v-if="fullInfo.type != 'phys'" value="operator">Туроператор</a-radio-button>
          <a-radio-button v-if="fullInfo.type != 'phys' && fullInfo.type == 'company'" value="agency">Турагенство
          </a-radio-button>
        </a-radio-group>
      </div>

    </a-col>
    <a-col v-if="fullInfo.type == 'phys' || fullInfo.type == 'entrepreneur'" :span="12">
      Фaмилия Имя
      <a-input v-model:value="fullInfo.fullname" style="width: 100%" placeholder="Иванов Иван Иванович" />
    </a-col>
    <a-col v-else :span="12">
      Название
      <a-input v-model:value="fullInfo.companyName" style="width: 100%" placeholder="ООО Песня" />
    </a-col>
    <a-col :span="12">
      Телефон
      <a-input v-model:value="fullInfo.phone" style="width: 100%" placeholder="79127528874" />
    </a-col>



    <a-col v-if="fullInfo.type == 'company' || fullInfo.type == 'entrepreneur'" :span="12">
      ИНН
      <a-input v-model:value="fullInfo.govermentRegNumber" style="width: 100%" placeholder="182900********" />
    </a-col>
  </a-row>
</template>