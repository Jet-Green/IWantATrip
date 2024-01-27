<script setup>
import { ref } from 'vue'

const props = defineProps({
    contract: Object
})
const emit = defineEmits(['addContractEmail', 'deleteContractEmail'])

const contract = props.contract

let contractEmail = ref('')
let addContractEmailDialog = ref(false)

function addContractEmail() {
    emit('addContractEmail', { contractEmail: contractEmail.value, contract })
}
function deleteContractEmail(email) {
    emit('deleteContractEmail', { contractEmail: email, contract })
}
</script>
<template>
    <a-card class="pa-8">
        <a-modal v-model:open="addContractEmailDialog" @ok="addContractEmail" cancelText="отмена" okText="отправить"
            :mask="false">
            email пользователя
            <a-input placeholder="gorodaivesi@gmail.com" v-model:value="contractEmail"></a-input>
        </a-modal>

        <div>
            <b>Название: </b>{{ contract.name }}
        </div>
        <div>
            <b>ИНН: </b>{{ contract.inn }}
        </div>
        <div>
            <b>КПП: </b>{{ contract.kpp }}
        </div>
        <div>
            <b>ОГРН: </b>{{ contract.ogrn }}
        </div>
        <div>
            <b>Юр. адрес: </b>{{ contract.yr_address }}
        </div>
        <div>
            <b>Фактический адрес: </b>{{ contract.fact_address }}
        </div>
        <div>
            <b>Р/сч: </b>{{ contract.checking_account }}
        </div>
        <div>
            <b>Банк р/сч: </b>{{ contract.checking_account_bank }}
        </div>
        <div>
            <b>К/сч: </b> {{ contract.cash_account }}
        </div>
        <div>
            <b>Банк к/сч: </b>{{ contract.cash_account_bank }}
        </div>
        <div>
            <b>БИК: </b>{{ contract.bik }}
        </div>
        <div>
            <b>Телефон: </b>{{ contract.phone }}
        </div>
        <div>
            <b>Email: </b>{{ contract.email }}
        </div>
        <div>
            <b>Директор: </b>{{ contract.director }}
        </div>

        <div>
            <b>Пользователи: </b>
            <a-tag style="font-size: 13px;" v-for="email in contract.userEmails" closable
                @close="deleteContractEmail(email)">{{ email }}</a-tag>

            <a-button size="small" @click="addContractEmailDialog = true">
                <span class="mdi mdi-plus"></span>
            </a-button>
        </div>
    </a-card>
</template>