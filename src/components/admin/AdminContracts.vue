<script setup>
import { reactive, ref } from "vue"

let addContractModal = ref(false)

let contractEmail = ref('')
let contractForm = reactive({
    // поля
})

function addContract() {
    // пока только вывести
    console.log(contractForm);
}
</script>
<template>
    <a-row>
        <a-col :span="24">
            <h3>Договоры</h3>
            <a-button type="primary" class="lets_go_btn" @click="addContractModal = true">добавить</a-button>
            <a-modal v-model:open="addContractModal" title="Добавить контракт" @ok="addContract" ok-text="отправить"
                cancel-text="отмена">
                <a-input placeholder="email" size="large" v-model:value="contractEmail"></a-input>

            </a-modal>
            форма
            <!-- <a-row>
                <a-col :span="24">
                    <a-card>

                    </a-card>
                </a-col>
            </a-row> -->
        </a-col>
    </a-row>
</template>