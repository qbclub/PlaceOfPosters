export default defineNuxtPlugin( {
    clearDate(dataString) {

        let date = 0
        if (dataString.length == 13) {
            const dataFromString = new Date(Number(dataString));
            date = dataFromString

        } else {
            date = new Date(dataString)
        };
        return date.toLocaleDateString("ru-Ru", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",

        })
    },
    dateForOrd() {
      return  new Date().toISOString().split('T')[0]
    },
    dateWithTime(dataString) {
        let date = 0
        if (dataString.length == 13) {
            const dataFromString = new Date(Number(dataString));
            date = dataFromString

        } else {
            date = new Date(dataString)
        };
        return date.toLocaleDateString("ru-Ru", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",

        })
    }
} )