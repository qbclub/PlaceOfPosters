export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return //пропускаем, когда код выполняется на сервере

    let authStore = useAuth()
    if (!authStore.isAuth)
        await authStore.checkAuth()
    if (!authStore.isAuth)
        return navigateTo('/auth')
})