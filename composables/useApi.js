import { defu } from 'defu'

export function useApi(url, options, settings) {
    const config = useRuntimeConfig()

    const defaults = {
        baseURL: config.public.apiBase,
        // set user token if connected
        onRequest({ request, options }) {
            // Set the request headers
            options.headers = options.headers || {}
            options.headers.authorization = `Bearer ${localStorage.getItem('token')}`
        },
        onRequestError({ request, options, error }) {
            // Handle the request errors
        },
        onResponse({ request, response, options }) {
            // Process the response data
            if (response._data.token) {
                console.log(response._data.token);
                localStorage.setItem('token', response._data.token)
            }
        },
        onResponseError({ request, response, options }) {
            // Handle the response errors
        }
    }
    // for nice deep defaults, please use unjs/defu
    const params = defu(options, defaults)

    return useFetch(url, params, settings)
}
