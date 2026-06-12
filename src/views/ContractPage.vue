<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BackButtonAdaptive from "../components/BackButtonAdaptive.vue";
import { useContract } from "../stores/contract";

const contractStore = useContract()
const route = useRoute();
const router = useRouter();

let currentContract = ref(null)
const partnerShopCode = computed(() => route.query.shopcode);

onMounted(async () => {
  let data = await contractStore.getContractByShopCode(partnerShopCode.value)
  if (data) {
    currentContract.value = data
  }
});
</script>

<template>
  <a-row class="flex justify-center">
    <a-col :xs="22" :md="20" :xl="18">
      <BackButtonAdaptive />
      <h1 class="mt-4">Предоставляется партнером</h1>

      <div v-if="currentContract">
        <a-card>
          <a-descriptions :column="{ xs: 1, sm: 2 }" bordered class="contract-descriptions">
            <template #title>Основная информация</template>

            <a-descriptions-item label="Название">{{ currentContract.name }}</a-descriptions-item>
            <a-descriptions-item label="Полное название">{{ currentContract.fullName }}</a-descriptions-item>
            <a-descriptions-item label="ИНН">{{ currentContract.inn }}</a-descriptions-item>
            <a-descriptions-item label="КПП">{{ currentContract.kpp }}</a-descriptions-item>
            <a-descriptions-item label="ОГРН">{{ currentContract.ogrn }}</a-descriptions-item>
            <a-descriptions-item label="ОКВЭД">{{ currentContract.okved }}</a-descriptions-item>
            <a-descriptions-item label="Email">{{ currentContract.email }}</a-descriptions-item>
            <a-descriptions-item label="Сайт">
              <a :href="currentContract.siteUrl" target="_blank">{{ currentContract.siteUrl }}</a>
            </a-descriptions-item>

          </a-descriptions>
        </a-card>

        <a-card v-if="currentContract.addresses?.length">
          <template #title>Адреса</template>
          <a-row :gutter="[16, 16]" style="padding-left: 16px;">
            <a-col :span="12" v-for="addr in currentContract.addresses" :key="addr._id">
              <a-card size="small">
                <strong>{{ addr.type === 'actual' ? 'Фактический' : 'Юридический' }}</strong>
                <p>{{ addr.country }}, {{ addr.city }}, {{ addr.street }}</p>
                <p>Индекс: {{ addr.zip }}</p>
              </a-card>
            </a-col>
          </a-row>
        </a-card>

        <a-card v-if="currentContract.ceo">
          <template #title>Руководитель</template>
          <a-descriptions :column="{ xs: 1, sm: 2 }" bordered>
            <a-descriptions-item label="ФИО">
              {{ currentContract.ceo.lastName }} {{ currentContract.ceo.firstName }} {{ currentContract.ceo.middleName
              }}
            </a-descriptions-item>
            <a-descriptions-item label="Телефон">{{ currentContract.ceo.phone }}</a-descriptions-item>
            <a-descriptions-item label="Гражданство">{{ currentContract.ceo.citizenship }}</a-descriptions-item>
          </a-descriptions>
        </a-card>

        <a-card v-if="currentContract.founders?.individuals?.length">
          <template #title style="padding: 16px !important;">Учредители</template>
          <div v-for="founder, idx in currentContract.founders.individuals" :key="idx" style="padding-left: 16px;">
            <p>{{ founder.lastName }} {{ founder.firstName }} — {{ founder.citizenship }}</p>
          </div>
        </a-card>

        <a-card v-if="currentContract.bankAccount">
          <template #title>Банковские реквизиты</template>
          <a-descriptions :column="{ xs: 1, sm: 2 }" bordered>
            <a-descriptions-item label="Счёт">{{ currentContract.bankAccount.account }}</a-descriptions-item>
            <a-descriptions-item label="БИК">{{ currentContract.bankAccount.bik }}</a-descriptions-item>
            <a-descriptions-item label="Банк">{{ currentContract.bankAccount.bankName }}</a-descriptions-item>
            <a-descriptions-item label="Назначение платежа">{{ currentContract.bankAccount.details
            }}</a-descriptions-item>
          </a-descriptions>
        </a-card>

        <a-card v-if="currentContract.shopInfo">
          <template #title>Информация о магазине</template>
          <a-descriptions :column="{ xs: 1, sm: 2 }" bordered>
            <a-descriptions-item label="Код магазина">{{ currentContract.shopInfo.code }}</a-descriptions-item>
          </a-descriptions>
        </a-card>
      </div>

      <a-empty v-else description="Контракт не найден" />
    </a-col>
  </a-row>
</template>

<style scoped>
.contract-descriptions :deep(.ant-descriptions-item-label) {
  padding: 12px 16px;
}

.contract-descriptions :deep(.ant-descriptions-item-content) {
  padding: 12px 16px;
}

.contract-descriptions :deep(.ant-descriptions-header) {
  padding: 16px;
  margin-bottom: 0;
}
</style>