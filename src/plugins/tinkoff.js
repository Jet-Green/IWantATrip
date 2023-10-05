import sha256 from 'js-sha256'
import axios from 'axios'

const VITE_TINKOFF_TERMINAL_ID = import.meta.env.VITE_TINKOFF_TERMINAL_ID
const VITE_TINKOFF_TERMINAL_PASS = import.meta.env.VITE_TINKOFF_TERMINAL_PASS

// https://securepay.tinkoff.ru/v2/Init
async function cancelPayment() {
    let cancelConfig = {
        "TerminalKey": "не скажу",
        // получается из Init
        "PaymentId": "3325950879",
        "Token": Token,
    }
    let res = await axios.post('https://securepay.tinkoff.ru/v2/Cancel', cancelConfig)

    return res
}

async function checkOrder(orderId, amount) {
    let payload = [
        { "Amount": amount },
        { "Password": VITE_TINKOFF_TERMINAL_PASS },
        { "PaymentId": orderId },
        { "TerminalKey": VITE_TINKOFF_TERMINAL_ID }
    ]
    const Token = sha256(payload)
    console.log(payload);
    const config = {
        "TerminalKey": VITE_TINKOFF_TERMINAL_ID,
        "OrderId": orderId,
        "Token": Token
    }
    let res = await axios.post('https://securepay.tinkoff.ru/v2/CheckOrder', config)

    return res
}

async function initPayment(orderId, amount) {
    let payload = [
        { "Amount": amount },
        { "Password": VITE_TINKOFF_TERMINAL_PASS },
        { "PaymentId": orderId },
        { "TerminalKey": VITE_TINKOFF_TERMINAL_ID }
    ]
    const Token = sha256(payload)

    let config = {
        "TerminalKey": VITE_TINKOFF_TERMINAL_ID,
        "Amount": amount,
        "OrderId": orderId,
        "Description": "Покупка тура",
        "Token": Token,
    }
    let res = await axios.post('https://securepay.tinkoff.ru/v2/Init', config)
    return { data: res.data, token: Token }
}

export default { initPayment, checkOrder }