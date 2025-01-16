<script setup>
import PartnerDialog from "./dialogs/PartnerDialog.vue"
import NewInteractionDialog from "./dialogs/NewInteractionDialog.vue"
import AddPayment from "./dialogs/AddPayment.vue"
import dayjs from 'dayjs';

import { toRefs, computed, ref, onMounted, reactive } from "vue"
import { useRouter } from "vue-router"
import { useTasks } from "../../../stores/tasks"
import { useAuth } from "../../../stores/auth"
import datePlugin from "../../../plugins/dates"

let props = defineProps(["task"])
let emit = defineEmits(["refreshTasks"])

const router = useRouter()
const taskStore = useTasks()
const userStore = useAuth()

// toRefs add reactivity
let { task } = toRefs(props)

let isCreator =  userStore.user.tinkoffContract||false
let viewPartnerDialog = ref(false)
let newInteractionDialog = ref(false)
let addPaymentDialog = ref(false)
let showInteraction = ref(false)
let showPayments = ref(false)

let taskDate = dayjs(task.value.deadLine + new Date().getTimezoneOffset()).format('DD.MM.YYYY')
let taskTime = dayjs(task.value.deadLine + new Date().getTimezoneOffset()).format('HH:mm')

const totalPaymentAmount = computed(() => {
  let res = 0
  for (let payment of task.value.payments) {
    res += Number(payment?.amount || 0)
  }
  return res
})

let getColor = computed( () => {

if (task.value.payAmount ==  totalPaymentAmount.value) {
  return  "background: #bcc662"
}
if ( totalPaymentAmount.value ==  0) {
  return  "background: #ff6600"
}
if (task.value.payAmount >  totalPaymentAmount.value) {
  return  "background: #20A0CE"
}

})

const currentOffset = new Date().getTimezoneOffset() * 60 * 1000
function getFullDate(date) {
  return datePlugin.getFullDate(date + currentOffset)
}

async function taskToDelete(_id) {
  let response = await taskStore.deletePlace(_id)
  if (response.status == 200) {
    emit("refreshTasks")
  }
}

function addNewInteraction() {
  // результат встречи с клиентом, тип встречи, статус задачи
  newInteractionDialog.value = true
}
let isStatusSetting = ref(false)
async function closeTask() {
  if (isStatusSetting.value) return
  isStatusSetting.value = true
  let res = await taskStore.changeStatus(task.value._id, "closed")
  if (res.status == 200) {
    setTimeout(() => {
      isStatusSetting.value = false
      emit("refreshTasks")
    }, 600)
  }
}

async function openTask() {
  if (isStatusSetting.value) return
  isStatusSetting.value = true
  let res = await taskStore.changeStatus(task.value._id, "open")
  if (res.status == 200) {
    setTimeout(() => {
      isStatusSetting.value = false
      emit("refreshTasks")
    }, 600)
  }
}




{/* <span v-if="billTotal(BILL) == BILL.payment.amount" style="color: #bcc662">
                                        <span class="mdi mdi-check-all" style="font-size: 20px"></span>
                                        оплачен
                                    </span>
                                    <span v-if="billTotal(BILL) != BILL.payment.amount"
                                        style="display: flex; align-items: center">
                                        <div v-if="BILL.payment.amount == 0" style="color: #ff6600">
                                            <span class="mdi mdi-close" style="font-size: 20px; "></span>
                                            не оплачен
                                        </div>
                                        <div v-else style="color: #20A0CE">
                                            <span class="mdi mdi-check" style="font-size: 20px"></span>
                                            частично
                                        </div>
                                    </span> */}


</script>
<template>
  <a-card class="pa-8 pb-32" v-if="task._id">
    <div class="status">
      <span class="mdi mdi-checkbox-blank-outline open-status" @click="closeTask"
        v-if="task.status == 'open' && !isStatusSetting"></span>
      <a-spin v-else-if="isStatusSetting" />
      <span @click="openTask" class="mdi mdi-checkbox-marked closed-status"
        v-if="task.status == 'closed' && !isStatusSetting"></span>
    </div>


    <div style="font-weight: 600; font-size:18px">{{ taskDate }} до {{ taskTime }} </div>
    <div class="task-name pa-4 ma-4" @click="router.push(`/create-task?_id=${task._id}`)">
      {{ task.name }}
      <!-- <span @click="router.push(`/create-task?_id=${task._id}`)" class="mdi mdi-pen"></span> -->
    </div>
    <div v-if="task.trip" style="font-weight: 500;" class="pa-4 ma-4"> {{ task.trip.name }} от {{ dayjs(task.trip.start +
      task.trip.timezoneOffset).format('DD.MM.YYYY') }}
    </div>
    <a-card v-if="task.partner?._id" class="pa-4 ma-4">
      <div class="d-flex flex-wrap" style="gap: 5px 20px;">
        <div style="cursor: pointer;" @click="viewPartnerDialog = true">

          {{ task.partner.category }}: {{ task.partner.name }}

        </div>
        <div>
          <a :href="`tel:${task.partner?.phone}`">
            тел: <b>{{ task.partner?.phone }}</b>
          </a>
        </div>
        <div>

        </div>
        <div>
          <a :href="`mailto:${task.partner?.email}`">
            почта: <b>{{ task.partner?.email }}</b>
          </a>
        </div>
        <div>

          контакт: {{ task.partner?.contactPerson }}
        </div>
      </div>
    </a-card>

    <div class="d-flex space-around flex-wrap mb-4" >
      <div>
        <a-badge :dot="true" v-if="task.interactions?.length>0" :offset=[-3,3]>
        <a-button @click="showInteraction = !showInteraction">
          Действия
        </a-button>
      </a-badge>
      <a-button v-else @click="showInteraction = !showInteraction">
          Действия
        </a-button>
        <a-button @click="addNewInteraction">
          <span class="mdi mdi-plus"></span>
        </a-button>
      </div>
      <div style="min-width: 200px;"  >
        <a-button @click="showPayments = !showPayments" v-if="task.payAmount"  style='color:white' :style='getColor'>
          <div v-if="task.payAmount">

            {{ totalPaymentAmount }}/
            {{ task.payAmount }} ₽
          </div>
        </a-button>
        <a-button @click="addPaymentDialog = true" v-if="task.payAmount">
          <span class="mdi mdi-plus"></span>
        </a-button>
      </div>
    </div>


    <div>

      <a-row :gutter="[8, 8]">
        <a-col :span="24" :md="12" v-if="showInteraction">
          <a-card style="height: 100%; padding:8px">
            <h3>Действия</h3>
            <div v-if="task?.interactions.length == 0"> Пусто </div>
            <div v-else :span="24">
              <div v-for="(inter, index) of task.interactions" :key="index" style="gap: 10px;">
                <div>

                  <div >
                    {{ dayjs(inter.date + new Date().getTimezoneOffset()).format('DD.MM.YYYY HH.mm') }} - {{
                      inter.meetingType }}
                  </div>



                  <div style="font-weight: bold">{{ inter.result }}
                  </div>


                </div>
                <a-divider style="margin:4px"></a-divider>
              </div>

            </div>
          </a-card>

        </a-col>
        <a-col v-if="showPayments" :span="24" :md="showInteraction?{ span: 12}:{span:12, offset: 12 }" >
          <a-card style="height: 100%; padding:8px">
            <h3>Оплаты</h3>
            <div v-for="(payment, index) of task.payments" :key="index">
              {{ dayjs(payment.date + new Date().getTimezoneOffset()).format('DD.MM.YYYY') }} <b>{{ payment.amount }}
                руб.</b> - {{ payment.document }}
              <a-divider style="margin:4px"></a-divider>
            </div>

          </a-card>

        </a-col>
      </a-row>



    </div>

    <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="taskToDelete(task._id)" v-if="isCreator">
      <span class="mdi mdi-delete"
        style="color:#ff6600; font-size: 24px; position: absolute;   right: 5px;  bottom: 0px;"></span>
    </a-popconfirm>




    <PartnerDialog :partner="task.partner" :props-dialog="viewPartnerDialog" @close="viewPartnerDialog = false" />
    <NewInteractionDialog :taskId="task._id" :props-dialog="newInteractionDialog" @close="newInteractionDialog = false"
      @update="emit('refreshTasks')" />
    <AddPayment :props-dialog="addPaymentDialog" :taskId="task._id" :payments="task.payments" :payAmount="task.payAmount"
      @close="addPaymentDialog = false" @update="emit('refreshTasks')" />
  </a-card>
</template>
<style scoped lang="scss">
.deadline {
  line-height: 1.1;
  font-weight: 600;

  display: flex;
  flex-direction: column;
  // font-size: clamp(1.125rem, 0.9261rem + 0.5682vw, 1.375rem);
}

.partner {
  font-weight: 600;
  display: flex;

  font-size: clamp(1.125rem, 0.9261rem + 0.5682vw, 1.375rem);


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

.status {
  position: absolute;
  right: 5px;
  top: 5px;


  .mdi {
    font-size: 24px;
    cursor: pointer;
    line-height: 1;
  }

  .open-status {
    color: #ff6600;
  }

  .closed-status {
    color: #AEBC58;
  }
}

.task-name {
  background: rgb(237, 237, 237);
  font-size: 16px;
  cursor: pointer;
}
</style>
