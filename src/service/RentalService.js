import $api from '../plugins/axios'

export default {
  listings(params, signal) { return $api.get('/rental/listings', { params, signal }) },
  listing(id) { return $api.get(`/rental/listings/${encodeURIComponent(id)}`) },
  categories() { return $api.get('/rental/categories') },
}
export const rentalPrice = value => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value)
export const pickupLabel = value => ({ self_pickup: 'Самовывоз', delivery: 'Доставка' }[value] || value)
