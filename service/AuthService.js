import $api from "../utility/axios";

export default {
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
    }
}
