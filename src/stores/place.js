import { defineStore } from 'pinia'
import _ from 'lodash'
import PlaceService from '../service/PlaceService';

export const usePlaces = defineStore('places', {
  state: () => ({
    isFetching: false,
    places: [],
    filter: {
      search: '',
      category: '',
      location: { name: "", shortName: "", type: "Point", coordinates: [] },
      locationRadius: 0
    }
  }),
  getters: {
  },
  actions: {
    async getAll(page, query) {
      if (page == 1) {
        this.places = [];
      }
      try {
        if (!this.isFetching) {
          this.isFetching = true
          let response = await PlaceService.getAll(
            page, query
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
    async deletePlace(id) {
      try {
        const response = await PlaceService.deletePlace(id);
        return response
      } catch (err) {
        console.log(err);
      }
    },
    async hidePlace(id) {
      try {
        const response = await PlaceService.hidePlace(id);
        return response
      } catch (err) {
        console.log(err);
      }
    },

    async getById(_id) {
      try {
        const response = await PlaceService.getById(_id)
        return response
      } catch (error) {
        console.log(error);
      }
    },
    async moderatePlace(_id) {
      try {
        const response = await PlaceService.moderatePlace(_id)
        return response
      } catch (error) {
        console.log(error);
      }
    },
    async rejectPlace(_id) {
      try {
        const response = await PlaceService.rejectPlace(_id)
        return response
      } catch (error) {
        console.log(error);
      }
    },
    async edit(toSend) {
      try {
        const response = await PlaceService.edit(toSend)
        return response
      } catch (error) {
        console.log(error);
      }
    },
    async getForCreateTrip(search) {
      try {
        const response = await PlaceService.getForCreateTrip(search)
        return response
      } catch (error) {
        console.log(error);
        
      }
    }
  }
})