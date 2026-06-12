<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useAuth } from "../../stores/auth";
import UserService from "../../service/UserService";
import ExcursionService from "../../service/ExcursionService";
import { useRoute, useRouter } from "vue-router";
import tinkoffPlugin from "../../plugins/tinkoff";
import { message } from "ant-design-vue";

const pageSize = 9;
const pageTrips = ref(1);
const totalTrips = ref(0);
const loadingTrips = ref(false);
const tripBills = ref([]);

const pageExcursions = ref(1);
const totalExcursions = ref(0);
const loadingExcursions = ref(false);
const excursionBills = ref([]);

const userStore = useAuth();

const pagesTrips = computed(() =>
  pageSize > 0 ? Math.ceil(totalTrips.value / pageSize) : 0
);
const pagesExcursions = computed(() =>
  pageSize > 0 ? Math.ceil(totalExcursions.value / pageSize) : 0
);

const billTotal = (bill) => {
  const cartSum = (bill?.cart || []).reduce((acc, o) => acc + o.count * o.cost, 0);
  const addSum = (bill?.additionalServices || []).reduce(
    (acc, o) => acc + o.count * o.price,
    0
  );
  return cartSum + addSum;
};

const clearDate = (dateNumber) => {
  const date = new Date(dateNumber).toLocaleDateString("ru-Ru", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
  return date !== "Invalid Date" && date ? date : "";
};

const excursionTime = (timeObj) => {
  if (!timeObj) return "";
  const h = String(timeObj.hours ?? "").padStart(2, "0");
  const m = String(timeObj.minutes ?? "").padStart(2, "0");
  return `${h}:${m}`;
};

const excursionTotal = (bill) =>
  (bill?.cart || []).reduce((acc, o) => acc + (o.count || 0) * (o.price || 0), 0);

const route = useRoute();
const router = useRouter();

const payModalOpen = ref(false);
const payBillLoading = ref(false);
const payBill = ref(null);

async function fetchTripBills() {
  if (!userStore.isAuth) return;
  loadingTrips.value = true;
  const res = await UserService.getMyBills(pageTrips.value, pageSize);
  if (res?.data) {
    tripBills.value = res.data.items || [];
    totalTrips.value = res.data.total || 0;
  }
  loadingTrips.value = false;
}

async function fetchExcursionBills() {
  if (!userStore.isAuth) return;
  loadingExcursions.value = true;
  const res = await ExcursionService.getMyBills(pageExcursions.value, pageSize);
  if (res?.data) {
    excursionBills.value = res.data.items || [];
    totalExcursions.value = res.data.total || 0;
  }
  loadingExcursions.value = false;
}

async function openPayByBillId(billId) {
  if (!billId) return;
  payBillLoading.value = true;
  const res = await ExcursionService.getMyBillById(billId);
  if (res?.data?._id) {
    payBill.value = res.data;
    payModalOpen.value = true;
  }
  payBillLoading.value = false;
}

async function payExcursionBill() {
  if (!payBill.value?._id) return;
  if (!payBill.value?.excursion?.tinkoffContract?.ShopCode) {
    message.config({ duration: 3, top: "90vh" });
    message.error({ content: "У экскурсии не настроен договор для оплаты." });
    return;
  }
  const orderId = `exbill_${payBill.value._id}_${Date.now()}`;
  const { data, token, success } = await tinkoffPlugin.initExcursionPayment(
    orderId,
    payBill.value.cart || [],
    userStore.user.email,
    payBill.value.excursion.tinkoffContract,
    payBill.value.excursion.name
  );
  if (!success) {
    message.config({ duration: 3, top: "90vh" });
    message.error({ content: "Ошибка при инициализации оплаты" });
    return;
  }
  const tinkoff = {
    orderId: data.OrderId,
    amount: data.Amount,
    token,
    paymentId: data.PaymentId,
  };
  await ExcursionService.updateBill({ billId: payBill.value._id, tinkoff });
  if (data?.PaymentURL) {
    window.open(data.PaymentURL, "_blank");
  }
}

onMounted(async () => {
  await fetchTripBills();
  await fetchExcursionBills();
  const billToPay = route.query.bill_to_pay;
  if (billToPay) {
    await openPayByBillId(String(billToPay));
  }
});

watch(
  () => route.query.bill_to_pay,
  async (billToPay) => {
    if (!billToPay) return;
    await openPayByBillId(String(billToPay));
  }
);
</script>

<template>
  <div>
    <h3 class="mt-8 mb-8">Мои заказы</h3>

    <div v-if="!userStore.isAuth" class="ma-8">
      Войдите в аккаунт, чтобы увидеть свои заказы.
    </div>

    <div v-else>
      <h4 class="mt-8 mb-8">Туры</h4>
      <a-spin :spinning="loadingTrips">
        <a-row :gutter="[8, 8]">
          <a-col :lg="8" :sm="12" :xs="24" v-for="bill in tripBills" :key="bill._id">
            <a-card hoverable class="card">
              <div class="d-flex space-between">
                <div>
                  {{ bill.tripId?.name }}
                </div>
                <b>{{ clearDate(bill?.date) }}</b>
              </div>

              <div v-for="cartItem in bill.cart" :key="cartItem.costType">
                <div v-if="cartItem.count">
                  {{ cartItem.costType }} {{ cartItem.count }} x {{ cartItem.cost }} руб.
                </div>
              </div>

              <div v-if="bill.additionalServices?.length > 0">
                <hr />
                <div v-for="(service, idx) in bill.additionalServices" :key="idx">
                  {{ service.name }} {{ service.count }} x {{ service.price }} руб.
                </div>
              </div>

              <div class="d-flex justify-end mt-8">
                <span>Итого:</span>&nbsp;<b>{{ billTotal(bill) }} руб.</b>
              </div>
              <div class="d-flex justify-end">
                <span>Оплачено:</span>&nbsp;{{ bill.payment?.amount || 0 }} руб.
              </div>
            </a-card>
          </a-col>
        </a-row>

        <div class="d-flex justify-center mt-16" v-if="pagesTrips > 1">
          <a-pagination
            v-model:current="pageTrips"
            :page-size="pageSize"
            :total="totalTrips"
            :show-size-changer="false"
            @change="fetchTripBills"
          />
        </div>

        <div class="ma-8" v-if="!loadingTrips && tripBills.length === 0" style="color: rgba(0, 0, 0, 0.65);">
          Заказов по турам пока нет.
        </div>
      </a-spin>

      <h4 class="mt-24 mb-8">Экскурсии</h4>
      <a-spin :spinning="loadingExcursions">
        <a-row :gutter="[8, 8]">
          <a-col :lg="8" :sm="12" :xs="24" v-for="bill in excursionBills" :key="bill._id">
            <a-card hoverable class="card">
              <div class="d-flex space-between">
                <div>
                  {{ bill.excursion?.name || "Экскурсия" }}
                </div>
                <b>
                  {{ bill.date ? `${bill.date.day}.${String((bill.date.month ?? 0) + 1).padStart(2, "0")}.${bill.date.year}` : "" }}
                  {{ excursionTime(bill.timeObj) }}
                </b>
              </div>

              <div v-for="(item, idx) in (bill.cart || [])" :key="idx">
                {{ item.type }} {{ item.count }} x {{ item.price }} руб.
              </div>

              <div class="d-flex justify-end mt-8">
                <span>Итого:</span>&nbsp;<b>{{ excursionTotal(bill) }} руб.</b>
              </div>

              <div class="d-flex justify-end mt-8" v-if="bill.needPay">
                <a-button type="primary" class="lets_go_btn" @click="openPayByBillId(bill._id)">
                  оплатить
                </a-button>
              </div>
            </a-card>
          </a-col>
        </a-row>

        <div class="d-flex justify-center mt-16" v-if="pagesExcursions > 1">
          <a-pagination
            v-model:current="pageExcursions"
            :page-size="pageSize"
            :total="totalExcursions"
            :show-size-changer="false"
            @change="fetchExcursionBills"
          />
        </div>

        <div class="ma-8" v-if="!loadingExcursions && excursionBills.length === 0" style="color: rgba(0, 0, 0, 0.65);">
          Заказов по экскурсиям пока нет.
        </div>
      </a-spin>
    </div>
  </div>

  <a-modal
    v-model:open="payModalOpen"
    title="Оплата экскурсии"
    ok-text="Оплатить"
    cancel-text="Закрыть"
    :ok-button-props="{ class: 'lets_go_btn' }"
    :cancel-button-props="{ class: 'btn_light' }"
    :confirm-loading="payBillLoading"
    @ok="payExcursionBill"
    @cancel="payModalOpen = false"
  >
    <a-spin :spinning="payBillLoading">
      <div v-if="payBill">
        <div class="mb-8">
          <b>Экскурсия:</b> {{ payBill.excursion?.name }}
        </div>
        <div class="mb-8">
          <b>Дата/время:</b>
          {{ payBill.date ? `${payBill.date.day}.${String((payBill.date.month ?? 0) + 1).padStart(2, "0")}.${payBill.date.year}` : "" }}
          {{ excursionTime(payBill.timeObj) }}
        </div>
        <div class="mb-8">
          <b>Сумма:</b> {{ excursionTotal(payBill) }} руб.
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

