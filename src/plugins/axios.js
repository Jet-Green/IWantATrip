import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL

const $api = axios.create({
    // withCredentials: true,
    baseURL: API_URL
})

// for jwt auth
// $api.interceptors.request.use((config) => {
//     config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
//     return config;
// })

export default $api;