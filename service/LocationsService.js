import $api from "../utility/axios";

export default {

    fetchLocations() {
        return $api.get('/event-location/get-all', )
    },
 
}