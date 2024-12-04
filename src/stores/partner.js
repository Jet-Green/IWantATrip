import { defineStore } from 'pinia'
import _ from 'lodash'
import PartnerService from '../service/PartnerService';

export const usePartners = defineStore('partners', {
  state: () => ({
    isFetching: false,
    partners: [],
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
        this.partners = [];
      }
      try {
        if (!this.isFetching) {
          this.isFetching = true
          let response = await PartnerService.getAll(
            page, query
          );
          this.isFetching = false

          this.partners.push(...response.data);
          this.partners = _.uniqBy(this.partners, '_id')
          return this.partners
        }
      } catch (err) {
        console.log(err);
      }
    },
    async create(partner) {
      try {
        const response = await PartnerService.create(partner);
        return response
      } catch (err) {
        console.log(err);
      }
    },
    async deletePlace(id) {
      try {
        const response = await PartnerService.deletePlace(id);
        return response
      } catch (err) {
        console.log(err);
      }
    },

    async getById(_id) {
      try {
        const response = await PartnerService.getById(_id)
        return response
      } catch (error) {
        console.log(error);
      }
    },

    async edit(partnerId, form) {
      try {
        const response = await PartnerService.edit(partnerId, form)
        return response
      } catch (error) {
        console.log(error);
      }
    },
    async getForCreateTrip() {
      try {
        const response = await PartnerService.getForCreateTrip()
        return response
      } catch (error) {
        console.log(error);
        
      }
    }
  }
})