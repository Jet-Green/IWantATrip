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
                    Название: <b>{{ c.name }}</b>
                </div>
                <div>
                    ИНН: <b>{{ c.inn }}</b>
                </div>
                <div>
                    КПП: <b>{{ c.kpp }}</b>
                </div>
                <div>
                    ОГРН: <b>{{ c.ogrn }}</b>
                </div>
                <div>
                    Юр. адрес: <b>{{ c.yr_address }}</b>
                </div>
                <div>
                    Фактический адрес: <b>{{ c.fact_address }}</b>
                </div>
                <div>
                    Р/сч: <b>{{ c.checking_account }}</b>
                </div>
                <div>
                    Банк р/сч: <b>{{ c.checking_account_bank }}</b>
                </div>
                <div>
                    К/сч: <b>{{ c.cash_account }}</b>
                </div>
                <div>
                    Банк к/сч: <b>{{ c.cash_account_bank }}</b>
                </div>
                <div>
                    БИК: <b>{{ c.bik }}</b>
                </div>
                <div>
                    Телефон: <b>{{ c.phone }}</b>
                </div>
                <div>
                    Email: <b>{{ c.email }}</b>
                </div>
                <div>
                    Директор: <b>{{ c.director }}</b>
                </div>

                Email пользователя: {{ c.userEmail }}
            </a-card>
        </a-col>
    </a-row>
</template>