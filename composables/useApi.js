import { defu } from 'defu'
import AuthService from '~/service/AuthService'

export function useApi(url, options, settings) {
    const config = useRuntimeConfig()

    const defaults = {
        baseURL: config.public.apiBase,
        // set user token if connected
        async onRequest({ request, options }) {
            // Set the request headers
            const { data } = await useFetch('/api/access-token')

            options.headers = options.headers || {}
            options.headers.authorization = `Bearer ${data.value.token}`
        },
        onRequestError({ request, options, error }) {
            
        },
        async onResponse({ request, response, options }) {
           
        },
        async onResponseError({ request, response, options }) {
            if (response.status == 401) {
                await useAuth().checkAuth()
            }
            if (!process.server && response._data.message) {
                useShowingErrors().value.show = true
                useShowingErrors().value.message = response._data.message
            }
        }
    }
    // for nice deep defaults, please use unjs/defu
    const params = defu(options, defaults)

    return useFetch(url, params, settings)
}
