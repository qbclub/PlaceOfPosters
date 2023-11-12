import $api from "./axios";

export default {

    getLogsByUserId(_id, page) {
        return $api.get(`/event-log/get-logs-by-userId?_id=${_id}&page=${page}`)
    },

    getLogsLength (_id){
        return $api.get(`/event-log/get-logs-lenght?_id=${_id}`)
    }
}