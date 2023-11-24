import { useAuth } from "~/store/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
    let authStore = useAuth()
    if (!authStore.isAuth)
        await authStore.checkAuth()
    if (!authStore.isAuth)
        return '/auth'
})