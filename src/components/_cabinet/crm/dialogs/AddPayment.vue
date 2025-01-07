<script setup>
import { ref, watch, toRefs } from "vue"
import { message } from "ant-design-vue";

import { useTasks } from "../../../../stores/tasks"

const tasksStore = useTasks()

// dialog
let props = defineProps({
  taskId: String,
  propsDialog: Boolean,
})
let emit = defineEmits(["close", "update"])

let dialog = ref(false)

let { propsDialog, taskId } = toRefs(props)

watch(propsDialog, (newDialog) => {
  dialog.value = newDialog
})
// dialog

let payment = ref({
  amount: 0,
})

async function submit() {
  const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000

  let toSend = {
    ...payment.value,
    date: Date.now() + timezoneOffset,
  }

  let res = await tasksStore.addPayment(toSend, taskId.value)
  if (res.status == 200) {
    emit('update')
    
    message.config({ duration: 1.5, top: "70vh" })
    message.success({
      content: "Оплата добавлена!",
      onClose: () => {
        emit('close')
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

    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        Сумма
        <a-input-number style="width: 100%" v-model:value="payment.amount"></a-input-number>
      </a-col>

      <a-col :span="24" class="d-flex justify-center">
        <a-button @click="submit" class="lets_go_btn" type="primary">отправить</a-button>
      </a-col>
    </a-row>

    <template #footer></template>
  </a-modal>
</template>
