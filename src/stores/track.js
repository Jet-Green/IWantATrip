import { defineStore } from 'pinia'
import _ from 'lodash'
import TrackService from '../service/TrackService';

export const useTracks = defineStore('tracks', {
  state: () => ({
    isFetching: false,
    tracks: [],
    filter: {
      search: '',
      location: { name: "", shortName: "", type: "Point", coordinates: [] },
      locationRadius: 0,
      type: ''
    }

  }),
  getters: {
  },
  actions: {
    async getAll(page,filter) {
        console.log(filter)
      if (page == 1) {
        this.tracks = [];
      }
      try {
        if (!this.isFetching) {
          this.isFetching = true
          let response = await TrackService.getAll(
            page, filter
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
        console.log('track to edit:', track);
        const response = await TrackService.edit(track);
        return response
      } catch (err) {
        console.log(err);
      }
    },
    async editStats(data) {
      try {
        const response = await TrackService.editStats(data);
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
    async moderateTrack(id) {
      try {
        const response = await TrackService.moderateTrack(id);
        return response
      } catch (err) {
        console.log(err);
      }
    },
    async rejectTrack(id) {
      try {
        const response = await TrackService.rejectTrack(id);
        return response
      } catch (err) {
        console.log(err);
      }
    }
  }
});
