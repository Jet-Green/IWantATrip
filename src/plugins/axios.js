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
  const status = error?.response?.status;
  if (status != null && status >= 400) {
    message.config({ duration: 3, top: '90vh' });
    const msg = error.response?.data?.message;
    if (msg) {
      message.error({ content: msg });
    }
  }
  return Promise.reject(error);
});

export default $api;