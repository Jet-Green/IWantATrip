import { defineStore } from 'pinia'
import _ from 'lodash'
import PlaceService from '../service/PlaceService';

export const usePlaces = defineStore('places', {
  state: () => ({
    isFetching: false,
    places: []
  }),
  getters: {
  },
  actions: {
    async getAll(filter) {
      try {
        if (!this.isFetching) {
          this.isFetching = true
          let response = await PlaceService.getAll(
            filter
          );
          this.isFetching = false

          this.places.push(...response.data);
          this.places = _.uniqBy(this.places, '_id')
          return this.places
        }
      } catch (err) {
        console.log(err);
      }
    },
    async create(place) {
      try {
        const response = await PlaceService.create(place);
        return response
      } catch (err) {
        console.log(err);
      }
    },
    async getPlacesForModeration(status) {
      try {
        const response = await PlaceService.getPlacesForModeration(status)
        return response
      } catch (error) {
        console.log(error);
      }
    },
    async getById(_id) {
      try {
        const response = await PlaceService.getById(_id)
        return response
      } catch (error) {
        console.log(error);
      }
    }
  }
})