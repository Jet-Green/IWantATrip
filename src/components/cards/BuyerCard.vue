<script setup>

defineProps({
    customer: Object,
    BILL: Object
});
function getPhoneNumber(number) {
  return `tel:${number}`
}
</script>
<template>
 

    <a-card hoverable  class="pa-8" style="width: 100%;">
        <div>
            <span class="mdi mdi-account-outline" style=""></span>
            {{ customer.fullname }}
        </div>
        <div>
            <span class="mdi mdi-phone-outline" style=""></span>
            <a :href='getPhoneNumber(customer.phone)'> {{ customer.phone
            }}</a>

        </div>
        <div v-for="cartItem of BILL.cart">
            {{ cartItem.costType }} {{ cartItem.count }} x {{ cartItem.cost }} руб.

        </div>

        <div class="d-flex justify-end"> <span>Итого: </span>
            {{
                BILL.cart.reduce((accumulator, object) => {
                    return accumulator + object.cost *
                        object.count;
                }, 0)
            }} руб.
        </div>

        <div class="d-flex justify-end">
            <b>
                <span v-if="BILL.isBoughtNow" style="color: #BCC662">
                    <span class="mdi mdi-check-all" style="font-size: 20px;"></span>
                    оплачен
                </span>
                <span v-else style="display: flex; align-items: center;">
                    <span class="mdi mdi-close" style="font-size: 20px;"></span>
                    не оплачен
                </span>
            </b>
        </div>

    </a-card>
</template>
<style lang="scss" scoped></style>
