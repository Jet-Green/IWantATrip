import $api from '../plugins/axios'

export default {
  createTripPayment({ billId, tripId, returnUrl }) {
    return $api.post('/payments/yookassa/trip-payment', { billId, tripId, returnUrl })
  },
}
