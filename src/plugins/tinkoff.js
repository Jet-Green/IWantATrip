import sha256 from 'js-sha256'
import axios from 'axios'

const VITE_TINKOFF_TERMINAL_ID = import.meta.env.VITE_TINKOFF_TERMINAL_ID
const VITE_TINKOFF_TERMINAL_PASS = import.meta.env.VITE_TINKOFF_TERMINAL_PASS

// https://securepay.tinkoff.ru/v2/Init
async function cancelPayment() {
    let payload =
    {
        "Password": VITE_TINKOFF_TERMINAL_PASS,
        "PaymentId": "3388583831",
        "TerminalKey": VITE_TINKOFF_TERMINAL_ID
    }

    let stringPayload = ''
    for (let key of Object.keys(payload)) {
        stringPayload += payload[key]
    }

    const Token = sha256(stringPayload)

    let cancelConfig = {
        "TerminalKey": VITE_TINKOFF_TERMINAL_ID,
        // получается из Init
        "PaymentId": "3388583831",
        "Token": Token,
        // В случае полной отмены структура чека не передается. В случае частичной отмены необходимо передавать те товары, которые нужно отменить.
    }
    let res = await axios.post('https://securepay.tinkoff.ru/v2/Cancel', cancelConfig)

    return res
}

async function checkPayment(paymentId) {
    let tokentr = VITE_TINKOFF_TERMINAL_PASS + paymentId + VITE_TINKOFF_TERMINAL_ID
    let token = sha256(tokentr)
    // https://securepay.tinkoff.ru/v2/GetState
    const config = {
        "TerminalKey": VITE_TINKOFF_TERMINAL_ID,
        "PaymentId": paymentId,
        "Token": token
    }
    let res = await axios.post('https://securepay.tinkoff.ru/v2/GetState', config)

    return res
}

async function initPayment(orderId, amount) {
    let payload =
    {
        "Amount": amount,
        "Password": VITE_TINKOFF_TERMINAL_PASS,
        "OrderId": orderId,
        "TerminalKey": VITE_TINKOFF_TERMINAL_ID
    }

    let stringPayload = ''
    for (let key of Object.keys(payload)) {
        stringPayload += payload[key]
    }

    const Token = sha256(stringPayload)

    let config = {
        "TerminalKey": VITE_TINKOFF_TERMINAL_ID,
        "Amount": amount,
        "OrderId": orderId,
        "Description": "Покупка тура",
        "Token": Token,
        "Receipt": {
            "Email": "griahadzyin@gmail.com",
            "Taxation": 'usn_income',
            "FfdVersion": "1.2",
            "Items": [
                {
                    "Name": 'Тур',
                    "Price": amount,
                    "Quantity": 1,
                    "Amount": amount * 1,
                    "Tax": "none",
                    "PaymentMethod": "full_prepayment",
                    "PaymentObject": "service"
                }
            ]
        }
    }
    let res = await axios.post('https://securepay.tinkoff.ru/v2/Init', config)

    return { data: res.data, token: Token }
}

async function sendClosingReceipt(PaymentId, Amount) {
    let payload =
    {
        // "Amount": Amount,
        "Password": VITE_TINKOFF_TERMINAL_PASS,
        "PaymentId": PaymentId,
        "TerminalKey": VITE_TINKOFF_TERMINAL_ID
    }

    let stringPayload = ''
    for (let key of Object.keys(payload)) {
        stringPayload += payload[key]
    }

    const Token = sha256(stringPayload)

    let config = {
        "TerminalKey": VITE_TINKOFF_TERMINAL_ID,
        "PaymentId": PaymentId,
        "Token": Token,
        "Receipt": {
            "Email": "griahadzyin@gmail.com",
            "Taxation": 'usn_income',
            "FfdVersion": "1.2",
            "Items": [
                {
                    "Name": 'Тур',
                    "Price": Amount,
                    "Quantity": 1,
                    "Amount": Amount,
                    "Tax": "none",
                    "PaymentMethod": "full_prepayment",
                    "PaymentObject": "service"
                }
            ]
        }
    }
    // console.log(config);
    // return
    let res = await axios.post('https://securepay.tinkoff.ru/v2/SendClosingReceipt', config)

    console.log(res.data);
}

export default { initPayment, checkPayment, cancelPayment, sendClosingReceipt }