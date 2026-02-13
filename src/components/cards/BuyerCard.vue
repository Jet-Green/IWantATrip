<script setup>
defineProps({
    customer: Object,
    BILL: Object
});


function getPhoneNumber(number) {
    return `tel:${number}`
}

let totalAmount = BILL.cart.reduce((accumulator, object) => {
    return accumulator + object.cost *
        object.count;
}, 0)

</script>
<template>
    <a-card hoverable class="pa-8" style="width: 100%;">
        <div>
            <MdiIcon style="" name="account-outline" />
            {{ customer.fullname }}
        </div>
        <div>
            <MdiIcon style="" name="phone-outline" />
            <a :href='getPhoneNumber(customer.phone)'> {{ customer.phone
            }}</a>

        </div>
        <div v-for="cartItem of BILL.cart">
            {{ cartItem.costType }} {{ cartItem.count }} x {{ cartItem.cost }} руб.

        </div>

        <div class="d-flex justify-end"> <span>Итого: </span>
            {{
                totalAmount
            }} руб.
        </div>

        <div class="d-flex justify-end">
            <b>
                <span v-if="totalAmount == BILL.payment.amount" style="color: #BCC662">
                    <MdiIcon name="check-all" size="20px" />
                    
                    оплачен
                </span>
                <span v-else style="display: flex; align-items: center;">
                    <MdiIcon name="close" size="20px" />
                    не оплачен
                </span>
            </b>
        </div>

    </a-card>
</template>
<style lang="scss" scoped></style>
