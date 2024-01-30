<script setup>
import ContractCard from '../cards/ContractCard.vue';

import { notification } from 'ant-design-vue';
import { LoadingOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

import { onMounted, ref } from 'vue';
import { useContract } from '../../stores/contract'

const contractStore = useContract()


let addContractEmailMessage = ref('')
let addContractEmailMainMessage = ref('')
let notificationIcon = ref(h(LoadingOutlined, { style: 'color: #ff6600' }))

function clearDialog() {
    addContractEmailMessage.value = ''
    addContractEmailMainMessage.value = ''
}

async function addContractEmail({ contractEmail, contract }) {
    const contractId = contract._id
    // Нужен, чтобы их много не открывалось.
    let notificationKey = contractId + contractEmail
    // разные казусы бывают с message, поэтому лучше постоянно очищать перед использованием
    clearDialog()
    addContractEmailMessage.value = `Добавляем ${contract.fullName} в ${contractEmail}`

    // типа загрузка
    notification.open({
        message: () => addContractEmailMainMessage.value,
        description: () => addContractEmailMessage.value,
        placement: 'bottom',
        icon: () => notificationIcon.value,
        duration: 0,
        class: 'notification-custom',
        key: notificationKey
    });

    let response = await contractStore.addContractEmail(contractId, contractEmail)
    // если ошибка
    if (response.status == 201) {
        notificationIcon.value = h(WarningOutlined, { style: 'color: #ff6600' })

        clearDialog()
        addContractEmailMainMessage.value = response.data.message
        // тут 3 секунды, чтобы пользователь вдуплил, что происходит.
        setTimeout(() => {
            notification.close(notificationKey)
        }, 3000)
    }

    // если нет ошибки
    if (response.status == 200) {
        clearDialog()
        // зелёное уведомление
        notificationIcon.value = h(CheckCircleOutlined, { style: 'color: #BCC662' })
        addContractEmailMainMessage.value = 'Готово'

        setTimeout(() => {
            notification.close(notificationKey)
        }, 2000)
    }
}

async function deleteContractEmail({ contractEmail, contract }) {
    // простая операция, поэтому необязательно показывать диалоги
    let response = await contractStore.deleteContractEmail(contract._id, contractEmail)
}

onMounted(async () => {
    await contractStore.getAll()
})
</script>
<template>
    <a-row :gutter="[16, 16]">
        <a-col v-for="contract in contractStore.contracts" :span="24" :md="8" :key="contract._id">
            <ContractCard :contract="contract" @addContractEmail="addContractEmail"
                @deleteContractEmail="deleteContractEmail" />
        </a-col>
    </a-row>
</template>

<style scoped lang="scss">
.notification-custom {
    font-size: 7px !important;
}
</style>