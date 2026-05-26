<script setup>
import { ref, watch, computed } from 'vue'
import { message } from 'ant-design-vue'
import ContractService from '../service/ContractService'
import { getYookassaAccountId } from '../utils/yookassa'
import { useAuth } from '../stores/auth'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['update:open', 'saved'])

const userStore = useAuth()
const accountIdInput = ref('')
const saving = ref(false)

const contract = computed(() => userStore.user?.tinkoffContract)
const hasContract = computed(() => !!contract.value?._id)

watch(
  () => props.open,
  (visible) => {
    if (visible) {
      accountIdInput.value = getYookassaAccountId(contract.value)
    }
  }
)

function close() {
  emit('update:open', false)
}

async function save() {
  if (!hasContract.value) {
    message.warning('Сначала оформите договор с платформой')
    return
  }
  saving.value = true
  try {
    const res = await ContractService.saveYookassa(accountIdInput.value.trim())
    if (userStore.user?.tinkoffContract) {
      userStore.user.tinkoffContract = {
        ...userStore.user.tinkoffContract,
        yookassa: res.data.yookassa,
      }
    }
    message.success('ShopId ЮKassa сохранён')
    emit('saved', res.data)
    close()
  } catch (err) {
    message.error(err.response?.data?.message || 'Не удалось сохранить')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <a-modal
    :open="open"
    title="Подключение ЮKassa"
    :confirm-loading="saving"
    ok-text="Сохранить"
    cancel-text="Отмена"
    @ok="save"
    @cancel="close"
  >
    <p v-if="!hasContract" class="onboarding-hint onboarding-hint--warn">
      Для приёма оплаты по программе «Привет, мир» нужен договор с платформой. Оформите его в разделе договоров.
    </p>
    <template v-else>
      <p class="onboarding-hint">
        Укажите <b>ShopId</b> вашего магазина в ЮKassa — он используется при сплитовании платежей
        (бонусная программа «Привет, мир»). Номер магазина можно посмотреть в личном кабинете ЮKassa.
      </p>
      <div v-if="contract?.fullName" class="onboarding-contract">
        <div>Организация: <b>{{ contract.fullName }}</b></div>
        <div v-if="contract.inn">ИНН: <b>{{ contract.inn }}</b></div>
      </div>
      <label class="onboarding-label">ShopId в ЮKassa</label>
      <a-input
        v-model:value="accountIdInput"
        placeholder="Например, 123456"
        inputmode="numeric"
        :disabled="saving"
        @press-enter="save"
      />
    </template>
  </a-modal>
</template>

<style scoped>
.onboarding-hint {
  margin-bottom: 16px;
  line-height: 1.45;
  color: #444;
}
.onboarding-hint--warn {
  color: #c2410c;
}
.onboarding-contract {
  margin-bottom: 12px;
  padding: 10px 12px;
  background: #f5f8fa;
  border-radius: 8px;
  font-size: 14px;
}
.onboarding-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}
</style>
