import { defineStore } from 'pinia'
import { ref } from 'vue'
import PosterService from '../service/PosterService.js'

export const usePoster = defineStore('poster', {
    state: () => ({
        posters: [],
        isLoaded: false,
        page: 1,
        filter: ref({
            searchText: '',
            date: '',
            eventType: [],
            eventSubtype: [],
            posterType: ''
        }),
        isFetching: false,
        load: true
    }), 
    actions: {
        async getPosters(userId, posterStatus) {
            try {
                let response = await PosterService.getPosters(userId, posterStatus)
                return response.data
            } catch (error) {
                console.log(error);
            }
        },
        async getPostersMiniature(organizer,poster_id) {
            try {
                let response = await PosterService.getPostersMiniature(organizer,poster_id)
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

                let response = await PosterService.createPoster(poster, authStore.user._id)
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

            let send = Object.assign({}, filter)
            send.eventLocation = useLocations().location ? useLocations().location : ''
            send.radius = useLocations().radius ? useLocations().radius : ''
            send.coordinates = useLocations().coordinates ? useLocations().coordinates : ''
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
        async getManagerPostersOnModeration(status,cities,areas,regions) {
            try {
                let response = await PosterService.getManagerPostersOnModeration(status,cities,areas,regions)
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
