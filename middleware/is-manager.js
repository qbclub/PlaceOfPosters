export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return //пропускаем, когда код выполняется на сервере

    let authStore = useAuth()
    console.log(authStore.user)
    if (!authStore.user?.managerIn?.length) {
        await authStore.checkAuth()
    }
    if (!authStore.user?.managerIn?.length) {
        return abortNavigation()
    }
})