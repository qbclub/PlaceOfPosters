export default defineNuxtPlugin((nuxtApp) => {
    if (localStorage.getItem('location')) {
        useLocations().location = localStorage.getItem('location')
    }
    if (localStorage.getItem('filterForm')) {
        usePoster().filter = JSON.parse(localStorage.getItem('filterForm'))
    }
})
