import $api from "../plugins/axios";

export default {

    fetchLocations() {
        return $api.get('/event-location/get-all', )
    },
 
}