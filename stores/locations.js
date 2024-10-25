import { defineStore } from 'pinia'
import { ref } from 'vue';
import LocationsService from '../service/LocationsService.js'

export const useLocations = defineStore('locations', {
    state: () => ({
        eventlocations: ref([]),
        location: ref(''),
        radius: ref()
    }),
    getters: {
    },
    actions: {
   
        async fetchLocations() {
            try {
            
                let response = await LocationsService.fetchLocations()
                this.eventlocations = response.data
            } catch (error) {
                console.log(error);
            }
        },
    

    }
})