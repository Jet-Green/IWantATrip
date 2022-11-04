import { defineStore } from 'pinia'
import UserService from '../service/UserService'

export const useAuth = defineStore('auth', {
  state: () => ({
    isAuth: false,
    userStatus: 'user',
    user: null
  }),
  getters: {
    getUserStatus(state) {
      return state.userStatus
    },
    getAuthStatus(state) {
      return state.isAuth
    },

  },
  actions: {
    setUserStatus(text) {
      this.userStatus = text
    },
    async registration(email, password) {
      try {
        const response = await UserService.registration(email, password);
        localStorage.setItem('token', response.data.accessToken);

        console.log(response);

        this.isAuth = true
        this.user = response.data.user
      } catch (err) {
        alert(err.response?.data?.message)
      }
    },
    login() {
      this.isAuth = true;
    },
    logout() {
      this.isAuth = false;
    }
  },
})