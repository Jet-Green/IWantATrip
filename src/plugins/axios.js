import axios from 'axios'
import { message } from 'ant-design-vue';
import { useRouter } from "vue-router";

let router = useRouter()

export const API_URL = import.meta.env.VITE_API_URL

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

// for jwt auth
$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

$api.interceptors.response.use(function (response) {
    // Любой код состояния, находящийся в диапазоне 2xx, вызывает срабатывание этой функции
    // Здесь можете сделать что-нибудь с ответом
    // console.log(response);
    return response;
}, function (error) {
    // Любые коды состояния, выходящие за пределы диапазона 2xx, вызывают срабатывание этой функции
    // Здесь можете сделать что-то с ошибкой ответа
    // ошибка с кодом 400 используется для других функций
    if (error.response.status >= 400) {
        message.config({ duration: 3, top: '90vh' })
        message.error({ content: error.response?.data?.message })
        // console.log("ERROR: ", error);
    }
    return error
});

export default $api;