export const getAppState = async () => (await useFetch('/app-state/get-state', { baseURL: useRuntimeConfig().public.apiBase })).data
