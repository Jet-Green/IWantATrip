<script setup>
import { onMounted } from 'vue';
import { useContract } from '../../stores/contract'

const contractStore = useContract()

onMounted(async () => {
    await contractStore.getAll()
})
</script>
<template>
    <a-row :gutter="[16, 16]">
        <a-col v-for="c in contractStore.contracts" :span="24" :md="8">
            <a-card class="pa-8">
                <div>
                    <b>Название: </b>{{ c.name }}
                </div>
                <div>
                    <b>ИНН: </b>{{ c.inn }}
                </div>
                <div>
                    <b>КПП: </b>{{ c.kpp }}
                </div>
                <div>
                    <b>ОГРН: </b>{{ c.ogrn }}
                </div>
                <div>
                    <b>Юр. адрес: </b>{{ c.yr_address }}
                </div>
                <div>
                    <b>Фактический адрес: </b>{{ c.fact_address }}
                </div>
                <div>
                    <b>Р/сч: </b>{{ c.checking_account }}
                </div>
                <div>
                    <b>Банк р/сч: </b>{{ c.checking_account_bank }}
                </div>
                <div>
                    <b>К/сч: </b> {{ c.cash_account }}
                </div>
                <div>
                    <b>Банк к/сч: </b>{{ c.cash_account_bank }}
                </div>
                <div>
                    <b>БИК: </b>{{ c.bik }}
                </div>
                <div>
                    <b>Телефон: </b>{{ c.phone }}
                </div>
                <div>
                    <b>Email: </b>{{ c.email }}
                </div>
                <div>
                    <b>Директор: </b>{{ c.director }}
                </div>

                <div>
                    <b>Email пользователя: </b> {{ c.userEmail }}
                </div>
            </a-card>
        </a-col>
    </a-row>
</template>