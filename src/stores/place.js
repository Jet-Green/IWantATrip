import { defineStore } from 'pinia'

import PlaceService from '../service/PlaceService';

export const usePlaces = defineStore('places', {
  state: () => ({
  }),
  getters: {
  },
  actions: {
    async create(place) {
      try {
        const response = await PlaceService.create(place);
        return response
      } catch (err) {
        console.log(err);
      }
    },

  }
})