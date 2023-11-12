import $api from "./axios";

export default {
    getAppState() {
        return $api.get("/app-state/get-state");
    },
    addEventType(newEventType) {
        return $api.post("/app-state/add-event-type", { newEventType })
    },
    addEventSubtype(category_name, subcategory_name) {
        return $api.post("/app-state/add-event-subtype", { category_name, subcategory_name })
    },
    deleteEventSubtype(category_name, subcategory_name) {
        return $api.post("/app-state/delete-event-subtype", { category_name, subcategory_name })
    },
    deleteEventType(eventType) {
        return $api.post("/app-state/delete-event-type", { eventType })
    },
    getUsers() {
        return $api.get("/app-state/get-users")
    }
}