import $api from "../plugins/axios";

export default {
    async resetPassword(password, token, user_id) {
        return $api.post('/auth/reset-password', { password, token, user_id })
    },
    async forgotPassword(email) {
        return $api.post('/auth/forgot-password', { 'email': email })
    },
    async buyTrip(tripId, bill, emailHtml) {
        return $api.post(`/trips/buy-trip?_id=${tripId}`, { bill, emailHtml })
    },
    async registration(data) {
        return $api.post('/auth/registration', data)
    },
    async login(email, password) {
        return $api.post('/auth/login', { email, password })
    },
    async logout() {
        return $api.post('/auth/logout')
    },
    async updateUser(user) {
        return $api.post('/auth/update', user)
    },
    async addFeedback(feedbackAndEmail) {
        // должно быть /auth/add-feedback
        return $api.post('/add-feedback', feedbackAndEmail)
    },
    async cancelTrip(bill_id, user_id) {
        return $api.post('/auth/cancel-trip', {bill_id, user_id})
    },
    addTripCalc(userId, tripCalc) {
        return $api.post('/auth/add-trip-calc', { userId, tripCalc })
    },
    deleteTripType(userId, tripCalcId) {
        return $api.post('/auth/delete-trip-calc', { userId, tripCalcId })
    },
    getBoughtTrips(userId) {
        return $api.get(`/auth/get-bought-trips?user_id=${userId}`)
    },
    determineWinner() {
        return $api.get('/auth/determine-winner')
    }
}