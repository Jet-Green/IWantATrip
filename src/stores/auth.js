import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', {
  state: () => ({
   isAuth: true,
   userStatus:'admin'
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
  },
})