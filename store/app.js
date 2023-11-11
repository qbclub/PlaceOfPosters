// Utilities
import { defineStore } from 'pinia'
import appStateService from '@/service/AppStateService'
import OrdService from '@/service/OrdService'
import _ from 'lodash'

export const useAppStore = defineStore('app', {
    state: () => ({
        appState: {}
    }),
    actions: {
        async getAppState() {
            try {
                let response = await appStateService.getAppState()
                let orgResponse = await OrdService.getOrganization()
                this.appState = response.data
                this.appState.eventTypes = _.sortBy(this.appState.eventTypes, [function(o) { return o.name; }]);
                this.appState.organization = orgResponse?.data.organization
            } catch (error) {
                console.log(error);
            }
        },
        async addEventType(newEventType) {
            try {
                let res = await appStateService.addEventType(newEventType)
                if (res.status == 200) {
                    this.appState.eventTypes.push({ name: newEventType, subcategories: [] })
                }
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async addEventSubtype(category_name, subcategory_name) {
            try {
                let res = await appStateService.addEventSubtype(category_name, subcategory_name)
                if (res.status == 200) {
                    this.appState.eventTypes[this.appState.eventTypes.findIndex(type => type.name === category_name)].subcategories.push(subcategory_name)
                }
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async deleteEventSubtype(category_name, subcategory_name) {
            try {
                let res = await appStateService.deleteEventSubtype(category_name, subcategory_name)
                if (res.status == 200) {
                    this.appState.eventTypes[this.appState.eventTypes.findIndex(type => type.name === category_name)].subcategories = this.appState.eventTypes[this.appState.eventTypes.findIndex(type => type.name === category_name)].subcategories.filter(type => type !== subcategory_name)
                }
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async deleteEventType(eventType) {
            try {
                let res = await appStateService.deleteEventType(eventType)
                this.appState.eventTypes = this.appState.eventTypes.filter(type => type.name !== eventType)
            } catch (error) {
                console.log(error);
            }
        },
        async getUsers() {
            try {
                let {data} = await appStateService.getUsers()
                return data
            } catch (error) {
                console.log(error);
            }
        }
    }
})
