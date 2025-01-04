import { defineStore } from 'pinia'
import _ from 'lodash'
import TaskService from '../service/TaskService';

export const useTasks = defineStore('tasks', {
  state: () => ({
    isFetching: false,
    tasks: [],
    filter: {
      search: '',
      category: '',
      locationRadius: 0
    }
  }),
  getters: {
  },
  actions: {
    async getAll(page, query) {
      if (page == 1) {
        this.tasks = [];
      }
      try {
        if (!this.isFetching) {
          this.isFetching = true
          let response = await TaskService.getAll(
            page, query
          );
          this.isFetching = false

          this.tasks.push(...response.data);
          this.tasks = _.uniqBy(this.tasks, '_id')
          // Сортировка массива по полю deadLine с использованием lodash
          this.tasks = _.orderBy(this.tasks, [(task) => task.deadLine], ['asc']);
          return this.tasks
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getTasksAmount(query) {
      try {
      
          let response = await TaskService.getTasksAmount(
           query
          )
          return response.data
        
      } catch (err) {
        console.log(err);
      }

    },
    async create(task) {
      try {
        const response = await TaskService.create(task);
        return response
      } catch (err) {
        console.log(err);
      }
    },
    async deletePlace(id) {
      try {
        const response = await TaskService.deletePlace(id);
        return response
      } catch (err) {
        console.log(err);
      }
    },

    async getById(_id) {
      try {
        const response = await TaskService.getById(_id)
        return response
      } catch (error) {
        console.log(error);
      }
    },

    async edit(taskId, form) {
      try {
        const response = await TaskService.edit(taskId, form)
        return response
      } catch (error) {
        console.log(error);
      }
    },
    async getForCreateTrip() {
      try {
        const response = await TaskService.getForCreateTrip()
        return response
      } catch (error) {
        console.log(error);

      }
    },
    async createInteraction(interaction, taskId) {
      try {
        return await TaskService.createInteraction({ interaction, taskId })
      } catch (error) {
        console.log(error);
      }
    }
  }
})