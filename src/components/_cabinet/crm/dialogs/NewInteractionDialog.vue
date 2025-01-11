<script setup>
import { ref, watch, toRefs } from "vue"
import { useTasks } from "../../../../stores/tasks"

import { message } from "ant-design-vue";

const tasksStore = useTasks()

let props = defineProps({
  taskId: String,
  propsDialog: Boolean,
})
let emit = defineEmits(["close", "update"])

let { propsDialog, taskId } = toRefs(props)
let dialog = ref(false)

const meetingTypes = [
  {
    value: "Телефон",
    name: "Телефон",
  },
  {
    value: "Email",
    name: "Email",
  },
  {
    value: "Мессенджер",
    name: "Мессенджер",
  },
  {
    value: "Встреча",
    name: "Встреча",
  },
]

let form = ref({
  meetingType: "",
  result: "",
})

async function createNewInteraction() {
  let toSend = {
    ...form.value,
    date: Date.now(),
  }
  let res = await tasksStore.createInteraction(toSend, taskId.value)
  if (res.status == 200) {
    emit('update')
    
    message.config({ duration: 1.5, top: "70vh" })
    message.success({
      content: "Встреча записана!",
      onClose: () => {
        emit('close')
      },
    })
  }
}

watch(propsDialog, (newDialog) => {
  dialog.value = newDialog
})
</script>
<template>
  <a-modal v-model:open="dialog" @cancel="emit('close')">
    <template #title>
      <span class="mdi mdi-plus"></span>
      Добавить результат общения
    </template>

    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        Способ контакта
        <a-select v-model:value="form.meetingType" :options="meetingTypes" style="width: 100%"> </a-select>
      </a-col>
      <a-col :span="24">
        Результат
        <a-textarea v-model:value="form.result" placeholder="О чём договорились" allow-clear autoSize></a-textarea>
      </a-col>
      <a-col :span="24" class="d-flex justify-center">
        <a-button @click="createNewInteraction" class="lets_go_btn" type="primary">отправить</a-button>
      </a-col>
    </a-row>

    <template #footer></template>
  </a-modal>
</template>
