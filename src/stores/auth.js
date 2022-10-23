import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', {
  state: () => ({
    isAuth: false,
    userStatus: 'user'
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
    login() {
      this.isAuth = true;
    },
    logout() {
      this.isAuth = false;
    }
  },
})