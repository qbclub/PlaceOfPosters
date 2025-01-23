import $api from "../utility/axios";

export default {
    async getByEmail(email) {
        return $api.get(`/auth/get-by-email?email=${email}`)
    },
    async resetPassword(password, token, user_id) {
        return $api.post('/auth/reset-password', { password, token, user_id })
    },
    async forgotPassword(email) {
        return $api.post('/auth/forgot-password', { 'email': email })
    },
    async refresh() {
        return $api.post('/auth/refresh', { withCredentials: true })
        //  useApi('/auth/refresh', { method: 'GET' })
    },
    async registration(form) {
        return $api.post('/auth/registration', form)
    },
    async login(form) {
        return $api.post('/auth/login', form)
    },
    async logout() {
        return $api.post('/auth/logout')
    },
    async updateUser(user) {
        return $api.post('/auth/update', user)
    },
    // Не на месте надо перенести
    async buyPosters(buyEvent) {
        return $api.post('/auth/buy-posters', buyEvent)
    },
    async getSubscriptionCount(_id) {
        return $api.post('/auth/subscription-count', { _id: _id })
    },
    async incrementPaidPosters(_id, amount) {
        return $api.post('/auth/increment-paid-posters', { _id, amount})
    },
    async removeLocationToEmail(managerIn, email) {
        return $api.post('/auth/remove-location-to-email', { managerIn: managerIn, email: email })
    },
    async addLocationToEmail(email, select, location) {
        return $api.post('/auth/add-location-to-email', { email: email, select: select, location: location })
    },
    async removeManagerInLocations(email) {
        return $api.post('/auth/remove-manager-in-locations', { email: email })
    },
    async removeManager(email) {
        return $api.post('/auth/remove-manager', { email: email })
    },
    async getManagers() {
        return $api.get('/auth/get-managers')
    },
}
