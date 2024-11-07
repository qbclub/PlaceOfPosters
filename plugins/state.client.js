export default defineNuxtPlugin((nuxtApp) => {
    if (localStorage.getItem('location')) {
        useLocations().location = localStorage.getItem('location')
    }
    if (localStorage.getItem('filterForm')) {
        usePoster().filter = JSON.parse(localStorage.getItem('filterForm'))
    }
    if (localStorage.getItem('locationCoordinates')) {
        useLocations().coordinates = localStorage.getItem('locationCoordinates').split(',').map((item)=>parseFloat(item))
    }
    if (localStorage.getItem('locationCoordinates')) {
        useLocations().radius = Number(localStorage.getItem('locationRadius'))
    }
    // locationsStore.coordinates = localStorage.getItem('locationCoordinates').split(',').map((item)=>parseFloat(item))
    // locationsStore.radius = localStorage.getItem('locationRadius')
})
