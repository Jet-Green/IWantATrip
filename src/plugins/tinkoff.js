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

async function initPayment(orderId, cart, clientEmail, shopInfo, tripName, additionalServices) {
    let Items = []
    let totalAmount = 0
    for (let cartItem of cart) {
        if (cartItem.count) {
            Items.push(
                {
                    // Платформа Союз
                    "AgentData": {
                        "AgentSign": "another",
                        "OperationName": `"${cartItem.costType}":${tripName}`.slice(0, 24),
                        "Phones": ["+79128523316"],
                        "ReceiverPhones": ["+79128523316"],
                        "OperatorName": "Платформа Союз",
                        "OperatorAddress": "г.Глазов",
                        "OperatorInn": "1837013960"

                    },
                    // Поставщик тура
                    "SupplierInfo": {
                        "Phones": shopInfo.Phones,
                        "Name": shopInfo.Name,
                        "Inn": shopInfo.Inn
                    },
                    "PaymentMethod": "full_payment",
                    "PaymentObject": "service",
                    "Name": cartItem.costType,
                    "Price": cartItem.cost * 100,
                    "Quantity": cartItem.count,
                    "Amount": cartItem.cost * 100 * cartItem.count,
                    "Tax": "none",
                    "ShopCode": String(shopInfo.ShopCode),
                    "MeasurementUnit": "шт"
                },
            )
        }
        totalAmount += cartItem.cost * 100 * cartItem.count
    }
    for (let service of additionalServices) {
        Items.push(
            {
                // Платформа Союз
                "AgentData": {
                    "AgentSign": "another",
                    "OperationName": `"${service.name}":${tripName}`.slice(0, 24),
                    "Phones": ["+79128523316"],
                    "ReceiverPhones": ["+79128523316"],
                    "OperatorName": "Платформа Союз",
                    "OperatorAddress": "г.Глазов",
                    "OperatorInn": "1837013960"
                },
                // Поставщик тура
                "SupplierInfo": {
                    "Phones": shopInfo.Phones,
                    "Name": shopInfo.Name,
                    "Inn": shopInfo.Inn
                },
                "PaymentMethod": "full_payment",
                "PaymentObject": "service",
                "Name": service.name,
                "Price": service.price * service.count * 100,
                "Quantity": service.count,
                "Amount": service.price * service.count * 100,
                "Tax": "none",
                "ShopCode": String(shopInfo.ShopCode),
                "MeasurementUnit": "шт"
            },
        )
        totalAmount += service.price * service.count * 100
    }
    let payload =
    {
        "Amount": totalAmount,
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
        "Amount": totalAmount,
        "OrderId": orderId,
        "Description": `Покупка "${tripName}"`,
        "Token": Token,
        "Receipt": {
            "Email": clientEmail,
            "Taxation": 'usn_income',
            "FfdVersion": "1.05",
            "Items": Items,
        },
        "Shops": [
            {
                "ShopCode": String(shopInfo.ShopCode),
                "Name": "Тур",
                "Amount": totalAmount,
            }
        ]
    }

    let res = await axios.post('https://securepay.tinkoff.ru/v2/Init', config)
    return { data: res.data, token: Token, success: res.data.Success }
}

async function initExcursionPayment(orderId, cart, clientEmail, shopInfo, excursionName) {
    let Items = []
    let totalAmount = 0
    for (let cartItem of cart) {
        if (cartItem.count) {
            Items.push(
                {
                    // Платформа Союз
                    "AgentData": {
                        "AgentSign": "another",
                        "OperationName": `"${cartItem.type}":${excursionName}`.slice(0, 24),
                        "Phones": ["+79128523316"],
                        "ReceiverPhones": ["+79128523316"],
                    },
                    // Поставщик тура
                    "SupplierInfo": {
                        "Phones": shopInfo.Phones,
                        "Name": shopInfo.Name,
                        "Inn": shopInfo.Inn
                    },
                    "PaymentMethod": "full_payment",
                    "PaymentObject": "service",
                    "Name": cartItem.type,
                    "Price": cartItem.price * 100,
                    "Quantity": cartItem.count,
                    "Amount": cartItem.price * 100 * cartItem.count,
                    "Tax": "none",
                    "ShopCode": String(shopInfo.ShopCode),
                    "MeasurementUnit": "шт"
                },
            )
        }
        totalAmount += cartItem.price * 100 * cartItem.count
    }
    let payload =
    {
        "Amount": totalAmount,
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
        "Amount": totalAmount,
        "OrderId": orderId,
        "Description": `Покупка "${excursionName}"`,
        "Token": Token,
        "Receipt": {
            "Email": clientEmail,
            "Taxation": 'usn_income',
            "FfdVersion": "1.05",
            "Items": Items,
        },
        "Shops": [
            {
                "ShopCode": String(shopInfo.ShopCode),
                "Name": "Тур",
                "Amount": totalAmount,
            }
        ]
    }
    let res = await axios.post('https://securepay.tinkoff.ru/v2/Init', config)
    return { data: res.data, token: Token, success: res.data.Success }
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
            "Email": "sokolov-glazov@yandex.ru",
            "Taxation": 'usn_income',
            "FfdVersion": "1.05",
            "Items": [
                {
                    "Name": 'Тур',
                    "Price": Amount,
                    "Quantity": 1,
                    "Amount": Amount,
                    "Tax": "none",
                    "PaymentMethod": "full_payment",
                    "PaymentObject": "service"
                }
            ]
        }
    }
    // console.log(config);
    // return
    let res = await axios.post('https://securepay.tinkoff.ru/v2/SendClosingReceipt', config)


}

async function registerShop(shopData) {
    // https://sm-register.tinkoff.ru/register
    let res = await axios.post('https://sm-register.tinkoff.ru/register', shopData, { headers: { Authorization: `Bearer + ${import.meta.env.VITE_TINKOFF_SM_REGISTER_ACCESS_TOKEN}` } })
    console.log(res);
}

async function updateContract(contract) {
    // это обновит контракт, не трогать
    let accessToken = localStorage.getItem('tinkoffAccessToken')
    let stringShopCode = contract.shopInfo.code
    let res = await axios.patch(`https://sm-register.tinkoff.ru/register/${stringShopCode}`, contract, { headers: { Authorization: `Bearer + ${accessToken}` } })

    return res
}

async function checkAuth() {
    const env = import.meta.env
    const body = {
        grant_type: 'password',
        username: env.VITE_TINKOFF_USERNAME,
        password: env.VITE_TINKOFF_PASSWORD
    }
    let res = await axios.post('https://sm-register.tinkoff.ru/oauth/token', body, { auth: { Username: 'partner', Password: 'partner' } })
    if (res.status == 200) {
        localStorage.setItem('tinkoffAccessToken', res.data.access_token)
        localStorage.setItem('tinkoffRefreshToken', res.data.refresh_token)
        return true
    }
    return false
}

export default { initExcursionPayment, initPayment, checkPayment, cancelPayment, sendClosingReceipt, registerShop, updateContract, checkAuth }