<script setup>
import sha256 from 'js-sha256'
import axios from 'axios'
// https://securepay.tinkoff.ru/v2/Init
let payload = [{ "Amount": 140000 }, { "Password": "не скажу" }, { "PaymentId": "21092" }, { "TerminalKey": "не скажу" }]
const Token = sha256(payload)
// 21090 21091 21092
let config = {
    "TerminalKey": "не скажу",
    "Amount": 140000,
    "OrderId": "21092",
    "Description": "Савелию на еду",
    "Token": Token,
}

async function cancelPayment() {
    let cancelConfig = {
        "TerminalKey": "не скажу",
        // получается из Init
        "PaymentId": "3325950879",
        "Token": Token,
    }
    let res = await axios.post('https://securepay.tinkoff.ru/v2/Cancel', cancelConfig)
    console.log(res);
}

async function makeReq() {
    let res = await axios.post('https://securepay.tinkoff.ru/v2/Init', config)
    console.log(res);
}
</script>
<template>
    <div>
        <a-button @click="makeReq">
            сделать запрос
        </a-button>
        <a-button @click="makeReq">
            отменить платёж
        </a-button>
        {{ Token }}
        {{ config }}
    </div>
</template>