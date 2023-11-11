import { defineStore } from 'pinia'
import { useAuth } from './auth';
import PosterService from '../service/PosterService.js'
import { useLocations } from './locations.js';
import { render } from 'vue-email';
import PosterCreatedTemplate from '../email-templates/PosterCreatedTemplate.vue'

let locationsStore = useLocations()

export const usePoster = defineStore('poster', {
    state: () => ({
        posters: [],
        isLoaded: false,
        page: 1,
        filter: {},
        isFetching: false,
        load: true

    }),
    getters: {
    },
    actions: {
        async getPosters(userId, posterStatus) {
            try {
                let response = await PosterService.getPosters(userId, posterStatus)
                return response.data
            } catch (error) {
                console.log(error);
            }
        },
        async createPosterDraft(poster) {
            try {
                let authStore = useAuth()

                let response = await PosterService.createPosterDraft(poster, authStore.user._id)

                authStore.user.posterDrafts?.push(response.data)

                return response.data
            } catch (error) {
                console.log(error);
            }
        },
        async createPoster(poster) {
            try {
                let authStore = useAuth()

                const emailHtml = await render(PosterCreatedTemplate, poster);

                let response = await PosterService.createPoster(poster, authStore.user._id, emailHtml)
                authStore.user.posters.push(response.data._id)

                return response.data._id
            } catch (error) {
                console.log(error);
            }
        },
        async editPoster(poster, _id, hotfix) {
            try {
                let response = await PosterService.editPoster(poster, _id, hotfix)
                return response.data
            } catch (error) {
                console.log(error);
            }
        },
        async updatePoster(poster) {
            try {
                let response = await PosterService.updatePoster(poster)
                return response.data._id
            } catch (error) {
                console.log(error);
            }
        },


        async fetchPosters(filter) {

            // console.log(locationsStore.location)
            let send = Object.assign({}, filter)
            send.eventLocation = locationsStore.location ? locationsStore.location : ''
            send.page = this.page
            if (this.page == 1) {
                this.load = true
            }

            try {
                if (this.load) {
                    if (!this.isFetching) {
                        this.isFetching = true
                        this.isLoaded = false
                        let response = await PosterService.fetchPosters(send)
                        this.isFetching = false
                        let tempArr = [...response.data]
                        if (!tempArr.length) {
                            this.load = false
                        } else {
                            this.posters.push(...response.data)
                            this.page++

                        }
                        this.isLoaded = true
                    }
                }
            } catch (error) {
                console.log(error);
            }

        },
        async loadPosters(filter) {
            try {
                let response = await PosterService.find(filter)
                return response.data
            }
            catch (error) {
                return []
            }
        },
        async getById(_id) {
            try {
                let response = await PosterService.getById(_id)
                return response.data
            } catch (error) {
                console.log(error);
            }
        },
        async getPostersOnModeration(status) {
            try {
                let response = await PosterService.getPostersOnModeration(status)
                return response.data
            } catch (error) {
                console.log(error)
            }
        },
        async uploadImage(image, posterId) {
            try {
                let response = await PosterService.uploadImage(image, posterId)
                return response
            } catch (error) {
                console.log(error);
            }
        },
        async deletePosterById(_id) {
            try {
                let response = await PosterService.deletePosterById(_id, useAuth().user?.email)

                return response
            } catch (error) {
                console.log(error);
            }
        },
        async hidePosterById(_id, isHidden) {
            try {
                let response = await PosterService.hidePosterById(_id, isHidden)

                return response
            } catch (error) {
                console.log(error);
            }
        },
        async prolongPosterById(_id, publicationStart, publicationEnd, userId) {
            try {
                let response = await PosterService.prolongPosterById(_id, publicationStart, publicationEnd, userId)

                return response
            } catch (error) {
                console.log(error);
            }
        },



        async getPostersOnModeraion() {
            try {
                let response = await PosterService.getPostersOnModeraion()
                return response.data
            } catch (error) {
                console.log(error);
            }
        },
        async moderatePoster(_id, userId) {
            try {
                let res = await PosterService.moderatePoster(_id, userId);

                return res
            } catch (error) {
                console.log(error);
            }
        },
        async rejectPoster(_id, moderationMessage) {
            try {
                let res = await PosterService.rejectPoster(_id, moderationMessage)

                return res
            } catch (error) {
                console.log(error);
            }
        }
    }
})