// Utilities
import { defineStore } from 'pinia'
import eventLogsService from '../service/EventLogsService'

export const useLogsStore = defineStore('log', {
    state: () => ({
        userLogState: []
    }),
    actions: {
        async getLogsByUserId(_id, page) {
            try {
                let response = await eventLogsService.getLogsByUserId(_id,page)
                this.userLogState = response.data
            } catch (error) {
                console.log(error);
            }
        },
        async getLogsLength(_id) {
            try {
               return await eventLogsService.getLogsLength(_id)
            
            } catch (error) {
                console.log(error);
            }
        },

    }
})
