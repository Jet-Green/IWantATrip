<script setup>
import PartnerDialog from "./dialogs/PartnerDialog.vue"
import NewInteractionDialog from "./dialogs/NewInteractionDialog.vue"
import AddPayment from "./dialogs/AddPayment.vue"

import { toRefs, computed, ref, onMounted, reactive } from "vue"
import { useRouter } from "vue-router"
import datePlugin from "../../../plugins/dates"
import { useTasks } from "../../../stores/tasks"

let props = defineProps(["task"])
let emit = defineEmits(["refreshTasks"])

const router = useRouter()
const taskStore = useTasks()

// toRefs add reactivity
let { task } = toRefs(props)

let viewPartnerDialog = ref(false)
let newInteractionDialog = ref(false)
let addPaymentDialog = ref(false)

let deadline = datePlugin.excursions.getLocalDateFromUTC(task.value.deadLine, task.value.timezoneOffset)
let date = datePlugin.excursions.getPrettyDate(deadline)

const totalPaymentAmount = computed(() => {
  let res = 0
  for (let payment of task.value.payments) {
    res += Number(payment?.amount || 0)
  }
  return res
})

async function taskToDelete(_id) {
  let response = await taskStore.deletePlace(_id)
  if (response.status == 200) {
    emit("refreshTasks")
  }
}

async function addNewInteraction() {
  // результат встречи с клиентом, тип встречи, статус задачи
  newInteractionDialog.value = true
}
</script>
<template>
  <a-card class="card" v-if="task._id">
    <div
      style="
        width: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      "
    >
      <div style="font-weight: 700; font-size: clamp(1.125rem, 0.9261rem + 0.5682vw, 1.375rem)">
        {{ task.name }}
      </div>
      <router-link class="link" :to="`/trip?_id=${task.trip._id}`">
        {{ task.trip.name }}
      </router-link>
    </div>
    <a-row :gutter="[24, 24]">
      <a-col class="info-item deadline">
        <div class="date">
          {{ date.day + " " + date.month }}
        </div>
        <div class="time">к {{ deadline.hours + ":" + deadline.minutes }}</div>
      </a-col>

      <a-col class="info-item partner" v-if="task.partner?._id">
        <div class="d-flex align-center">
          <span class="link" @click="viewPartnerDialog = true">
            {{ task.partner.name }}<span class="mdi mdi-open-in-new"></span>
          </span>
        </div>

        <div class="actions">
          <a-button shape="circle" size="large" :href="`tel:${task.partner?.phone}`">
            <template #icon>
              <span class="mdi mdi-phone-outline"></span>
            </template>
          </a-button>

          <a-button shape="circle" size="large" class="ml-16" :href="`mailto:${task.partner?.email}`">
            <template #icon>
              <span class="mdi mdi-email-outline"></span>
            </template>
          </a-button>
        </div>
      </a-col>

      <a-col class="info-item payment" v-if="task.payAmount">
        <div class="amount">
          <b>
            {{ totalPaymentAmount }}
          </b>
          из
          <b> {{ task.payAmount }}₽ </b>
        </div>

        <a-button @click="addPaymentDialog = true" size="small" style="text-transform: none !important">
          оплата
          <template #icon>
            <span class="mdi mdi-cash-multiple mr-4"></span>
          </template>
        </a-button>
      </a-col>
    </a-row>
<!-- <a-row>
      <a-col :span="24">
        <a-collapse :bordered="false" ghost>
          <a-collapse-panel key="0" header="Менеджеры">
            <div class="managers">
              <div class="manager-card add-manager" @click="addManager">
                <span class="mdi mdi-plus"></span>
              </div>
              <div class="manager-card" v-for="manager of task.managers" :key="manager?._id">
                <div class="info">
                  {{ manager.fullname }} <br />
                  <a :href="`mailto:${manager.email}`">{{ manager.email }}</a>
                </div>
                <div class="actions">
                  <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="managerToDelete(manager._id)">
                    <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
                  </a-popconfirm>
                </div>
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row> -->

    <a-row class="bordered" :gutter="[8, 8]">
      <a-col :span="24">
        <a-button @click="addNewInteraction"
          >Новая встреча
          <template #icon>
            <span class="mdi mdi-plus"></span>
          </template>
        </a-button>
      </a-col>
      <a-col :span="24">
        <a-collapse :bordered="false" ghost>
          <a-collapse-panel key="0" header="История общения">
            <a-row>
              <a-col v-if="task.interactions.length == 0"> Пусто </a-col>
              <a-col v-else :span="24">
                {{ task.interactions }}
              </a-col>
            </a-row>
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <div>
          <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="taskToDelete(task._id)">
            <span class="mdi mdi-delete" style="color: #ff6600"></span>
          </a-popconfirm>

          <a-popconfirm
            title="Редактировать?"
            ok-text="Да"
            cancel-text="Нет"
            @confirm="router.push(`/create-task?_id=${task._id}`)"
          >
            <span class="mdi mdi-pen"></span>
          </a-popconfirm>
        </div>
      </a-col>
    </a-row>

    <PartnerDialog :partner="task.partner" :props-dialog="viewPartnerDialog" @close="viewPartnerDialog = false" />
    <NewInteractionDialog
      :taskId="task._id"
      :props-dialog="newInteractionDialog"
      @close="newInteractionDialog = false"
    />
    <AddPayment
      :props-dialog="addPaymentDialog"
      :task-id="task._id"
      :payments="task.payments"
      @close="addPaymentDialog = false"
      @update="emit('refreshTasks')"
    />
  </a-card>
</template>
<style scoped lang="scss">
.info-item {
  border: 1px solid rgb(231, 231, 231);
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
}

.deadline {
  line-height: 1.1;
  font-weight: 600;

  display: flex;
  flex-direction: column;
  font-size: clamp(1.125rem, 0.9261rem + 0.5682vw, 1.375rem);
}

.partner {
  font-weight: 600;
  display: flex;

  font-size: clamp(1.125rem, 0.9261rem + 0.5682vw, 1.375rem);

  .link {
    text-decoration: underline;
    font-size: clamp(0.75rem, 0.4517rem + 0.8523vw, 1.125rem);
    font-weight: 400;
    cursor: pointer;
  }

  .actions {
    margin-left: 18px;
    height: 100%;
    display: flex;
    align-items: center;
  }
}

.payment {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: clamp(0.75rem, 0.4517rem + 0.8523vw, 1.125rem);
}
.managers {
  width: 100%;
  display: flex;
}
.manager-card {
  border: 1px solid rgb(231, 231, 231);
  border-radius: 10px;
  margin: 5px;
  padding: 5px;
  display: flex;
  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
  }
}
.add-manager {
  font-size: 30px;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
