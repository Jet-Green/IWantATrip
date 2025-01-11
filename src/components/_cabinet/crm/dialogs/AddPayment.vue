<script setup>
import { ref, watch, toRefs, computed } from "vue"
import { message } from "ant-design-vue"

import { useTasks } from "../../../../stores/tasks"

const tasksStore = useTasks()

// dialog
let props = defineProps({
  taskId: String,
  propsDialog: Boolean,
  payments: Array,
  payAmount: Number
})
let emit = defineEmits(["close", "update"])

let dialog = ref(false)

let { propsDialog, taskId, payAmount  } = toRefs(props)

const totalPaymentAmount = computed(() => {
  let res = 0
  for (let payment of props.payments) {
    res += Number(payment?.amount || 0)
  }
  return res
})
watch(propsDialog, (newDialog) => {
  dialog.value = newDialog
})
// dialog

let payment = ref({
  amount: 0,
  document: "",
})

async function submit() {

  if((totalPaymentAmount.value + payment.value.amount)> payAmount.value) {
    message.config({ duration: 2, top: "70vh" })
    message.success({
      content: "Оплата больше необходимой!",
      onClose: () => {
        emit("close")
      },
    })
    return
  }


  let toSend = {
    ...payment.value,
    date: Date.now(),
  }

  let res = await tasksStore.addPayment(toSend, taskId.value)
  if (res.status == 200) {
    emit("update")

    message.config({ duration: 1.5, top: "70vh" })
    message.success({
      content: "Оплата добавлена!",
      onClose: () => {
        emit("close")
      },
    })
  }
}
</script>
<template>
  <a-modal v-model:open="dialog" @cancel="emit('close')">
    <template #title>
      <span class="mdi mdi-plus"></span>
      Добавить оплату
    </template>
    {{ payAmount }} - {{ totalPaymentAmount }} осталось {{payAmount - totalPaymentAmount   }} руб
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        Сумма
        <a-input-number style="width: 100%" v-model:value="payment.amount"
          ></a-input-number>
      </a-col>

      <a-col :span="24">
        Документ
        <a-input v-model:value="payment.document"></a-input>
      </a-col>

      <a-col :span="24" class="d-flex justify-center">
        <a-button @click="submit" class="lets_go_btn" type="primary">отправить</a-button>
      </a-col>
    </a-row>

    <template #footer></template>
  </a-modal>
</template>
