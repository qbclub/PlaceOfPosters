import $api from "../utility/axios";

export default {
    addPrice(form) {
        return $api.post('/price/create',  form )
    },
    fetchPrices() {
        return $api.get('/price/get-all')
    }
}
