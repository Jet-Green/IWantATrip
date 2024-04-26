<script setup>
import { ref } from 'vue'
import { useContract } from '../../stores/contract'
import { useRouter } from 'vue-router'

let router = useRouter()



const contractStore = useContract()

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
async function deleteContract(_id) {
    await contractStore.deleteContract(_id)
    await contractStore.getAll()
}
function checkContract() {
    contractStore.setEditingContract(contract)
    router.push({ name: "AddAdminContract" })
}

</script>
<template>
    <a-card class="pa-8">
        <a-modal v-model:open="addContractEmailDialog" @ok="addContractEmail" cancelText="отмена" okText="отправить"
            :mask="false">
            email пользователя
            <a-input placeholder="gorodaivesi@gmail.com" v-model:value="contractEmail"></a-input>
        </a-modal>

        <div class="d-flex justify-center" v-if="!contract.hasOwnProperty('shopInfo')">
            <a-button class="lets_go_btn ma-8" type="primary" @click="checkContract()"> Проверить договор</a-button>
        </div>
        <div class="d-flex justify-center" v-if="!contract.hasOwnProperty('shopInfo')">
            <a-button class="btn_light ma-8" @click="deleteContract(contract._id)"> Удалить договор</a-button>
        </div>
        <div class="edit-btn">
            <a-button shape="circle" type="dashed" size="small"
                @click="router.push({ name: 'UpdateContract', query: { _id: contract._id } })">
                <template #icon>
                    <span class="mdi mdi-pencil"></span>
                </template>
            </a-button>
        </div>

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
            <b>Телефон: </b>{{ contract.ceo.phone }}
        </div>
        <div>
            <b>Email: </b>{{ contract.email }}
        </div>
        <div>
            <b>Директор: </b>{{ `${contract.ceo.firstName} ${contract.ceo.lastName} ` }}
        </div>

        <div>
            <b>Пользователи: </b>
            <a-tag style="font-size: 13px;" v-for="email in contract.userEmails" closable
                @close="deleteContractEmail(email)">{{
            email }}</a-tag>

            <a-button size="small" @click="addContractEmailDialog = true">
                <span class="mdi mdi-plus"></span>
            </a-button>
        </div>
    </a-card>
</template>
<style lang="scss" scoped>
.edit-btn {
    position: absolute;
    right: -10px;
    top: -10px;
}
</style>