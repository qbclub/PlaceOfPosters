import { defu } from 'defu'

export function useApi(url, options, settings) {
    const config = useRuntimeConfig()

    const defaults = {
        baseURL: config.public.apiBase,
        // set user token if connected
        async onRequest({ request, options }) {
            let nuxtApp = useNuxtApp()
            // Set the request headers
            const { data } = await useFetch('/api/access-token')

            options.headers = options.headers || {}
            // options.headers.authorization = `Bearer ${data.value.token}`
        },
        onRequestError({ request, options, error }) {
            // Handle the request errors
        },
        onResponse({ request, response, options }) {
        },
        onResponseError({ request, response, options }) {
            // Handle the response errors
        }
    }
    // for nice deep defaults, please use unjs/defu
    const params = defu(options, defaults)

    return useFetch(url, params, settings)
}
