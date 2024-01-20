import $api from "../utility/axios";

export default {
    getPostersOnModeration(status) {
        return $api.get(`/poster/get-posters-on-moderation?status=${status}`)
    },
    getPosters(userId, posterStatus) {
        return $api.get(`/poster/get-posters?user_id=${userId}&poster_status=${posterStatus}`)
    },
    getPostersMiniature(organizer,poster_id, posterStatus) {
        return $api.get(`/poster/get-posters-miniature?organizer=${organizer}&poster_id=${poster_id}&poster_status=${posterStatus}`)
    },
    createPosterDraft(poster, userId) {
        return $api.post('/poster/create-draft', { poster, userId })
    },
    createPoster(poster, user_id) {
        return $api.post('/poster/create', { poster, user_id })
    },
    updatePoster(poster) {
        return $api.post('/poster/update', poster)
    },
    fetchPosters(filters) {
        return $api.post('/poster/get-all', filters)
    },
    find(filters) {
        return $api.post('/poster/find', filters)
    },
    getById(_id) {
        return $api.get(`/poster/get-by-id?_id=${_id}`)
    },
    uploadImage(image, posterId) {
        return $api.post(`/poster/upload-image?poster_id=${posterId}`, image)
    },
    deletePosterById(_id, email) {
        return $api.get(`/poster/delete-by-id?_id=${_id}&email=${email}`)
    },
    hidePosterById(_id, isHidden) {
        return $api.get(`/poster/hide-by-id?_id=${_id}&isHidden=${isHidden}`)
    },
    prolongPosterById(_id, publicationStart, publicationEnd, userId) {
        return $api.post('/poster/prolong-by-id', { _id, publicationStart, publicationEnd, userId })
    },
    getUserPosters(posters) {
        return $api.post('/poster/get-user-posters', posters)
    },
    moderatePoster(_id, userId) {
        return $api.get(`/poster/moderate?_id=${_id}&userId=${userId}`)
    },
    rejectPoster(_id, message) {
        return $api.post('/poster/reject-poster', { message, _id })
    },
    editPoster(poster, _id, hotfix) {
        return $api.post(`/poster/edit?_id=${_id}`, { poster, hotfix })
    }
}