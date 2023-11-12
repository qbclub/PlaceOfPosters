import $api from "./axios";

export default {

    fetchLocations() {
        return $api.get('/event-location/get-all', )
    },
 
}