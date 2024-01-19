<script setup>
import { notification } from 'ant-design-vue';
import { LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

import { onMounted, ref } from 'vue';
import { useContract } from '../../stores/contract'

const contractStore = useContract()
let addContractEmailDialog = ref(false)


let contractEmail = ref('')
let addContractEmailMessage = ref('')
let addContractEmailMainMessage = ref('')
let notificationIcon = ref(h(LoadingOutlined, { style: 'color: #ff6600' }))

async function addContractEmail(contract) {
    const contractId = contract._id
    let notificationKey = contractId + contractEmail.value

    addContractEmailMessage.value = `Добавляем ${contract.fullName} в ${contractEmail.value}`

    notification.open({
        message: () => addContractEmailMainMessage.value,
        description: () => addContractEmailMessage.value,
        placement: 'bottom',
        icon: () => notificationIcon.value,
        duration: 0,
        class: 'notification-custom',
        key: notificationKey
    });
    let response = await contractStore.addContractEmail(contractId, contractEmail.value)

    // if (response.status == 400) {
    // }
    // if (res.status == 400) {
    //     addContractEmailMainMessage.value = res.data.message
    //     addContractEmailMessage.value = ''

    //     setTimeout(() => {
    //         notification.close(notificationKey)
    //     }, 1000)
    // }

    // setTimeout(() => {
    //     notificationIcon.value = h(CheckCircleOutlined, { style: 'color: #BCC662' })
    //     addContractEmailMainMessage.value = 'Готово'
    //     addContractEmailMessage.value = ''

    //     setTimeout(() => {
    //         notification.close(notificationKey)
    //     }, 1000)
    // }, 4000)

    // после всех вычислений
    // setTimeout(() => {
    //     
    // }, 1000)
}

onMounted(async () => {
    await contractStore.getAll()
})
</script>
<template>
    <a-row :gutter="[16, 16]">
        <a-col v-for="contract in contractStore.contracts" :span="24" :md="8">
            <a-card class="pa-8">
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
                    <b>Email пользователя: </b> {{ contract.userEmail }}
                    <a-button size="small" @click="addContractEmailDialog = true">
                        <span class="mdi mdi-plus"></span>
                    </a-button>
                </div>
            </a-card>
            <a-modal v-model:open="addContractEmailDialog" @ok="addContractEmail(contract)" cancelText="отмена"
                okText="отправить" :mask="false">
                email пользователя
                <a-input placeholder="gorodaivesi@gmail.com" v-model:value="contractEmail"></a-input>
            </a-modal>
        </a-col>
    </a-row>
</template>

<style scoped lang="scss">
.notification-custom {
    font-size: 7px !important;
}
</style>