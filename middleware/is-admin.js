export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return //пропускаем, когда код выполняется на сервере

    let authStore = useAuth()
    if (!authStore.user?.roles.includes('admin')) {
        await authStore.checkAuth()
    }
    if (!authStore.user?.roles.includes('admin')) {
        return abortNavigation()
    }
})