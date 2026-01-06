import { defineStore } from 'pinia'
import _ from 'lodash'
import TrackService from '../service/TrackService';

export const useTracks = defineStore('tracks', {
  state: () => ({
    isFetching: false,
    tracks: [],
    filter: {
      search: '',
      type: ''
    }
  }),
  getters: {
  },
  actions: {
    async getAll(page, query) {
      if (page == 1) {
        this.tracks = [];
      }
      try {
        if (!this.isFetching) {
          this.isFetching = true
          let response = await TrackService.getAll(
            page, query
          );
          this.isFetching = false

          if (response.data && response.data.tracks && Array.isArray(response.data.tracks)) {
            this.tracks.push(...response.data.tracks);
          }
          this.tracks = _.uniqBy(this.tracks, '_id')
          return this.tracks
        }
      } catch (err) {
        console.log(err);
        this.isFetching = false;
      }
    },
    async create(track) {
      try {
        const response = await TrackService.create(track);
        return response
      } catch (err) {
        console.log(err);
      }
    },
    async deleteTrack(id) {
      try {
        const response = await TrackService.deleteTrack(id);
        return response
      } catch (err) {
        console.log(err);
      }
    },
    async edit(track) {
      try {
        const response = await TrackService.edit(track);
        return response
      } catch (err) {
        console.log(err);
      }
    },
    async getById(_id) {
      try {
        const response = await TrackService.getById(_id);
        return response
      } catch (err) {
        console.log(err);
      }
    },
  }
});
