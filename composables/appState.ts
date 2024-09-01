export const getAppState = async () =>
  (
    await useFetch("/app-state/get-state", {
      baseURL: useRuntimeConfig().public.apiBase,
    })
  ).data;
export const getActiveCategories = async (location:string) =>
  (
    await useFetch(`/poster/get-active-categories?location=${location}`, {
      baseURL: useRuntimeConfig().public.apiBase,
    })
  ).data;
export const getActiveCities = async () =>
  (
    await useFetch("/poster/get-active-cities", {
      baseURL: useRuntimeConfig().public.apiBase,
    })
  ).data;
