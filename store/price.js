import { defineStore } from 'pinia'
import PriceService from '../service/PriceService'

export const usePrice = defineStore('price', {
    state: () => ({
        prices: []
    }),
    getters: {
    },
    actions: {
        async fetchPrices() {
            try {
                let response = await PriceService.fetchPrices()
                this.prices = response.data
                return response.data
            } catch (error) {
                console.log(error);
            }
        },
        async addPrice(form) {
            try {
                let response = await PriceService.addPrice(form)
                return response.data
            } catch (error) {
                console.log(error);
            }
        },


    }
})