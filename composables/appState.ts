export const getAppState = async () =>
  (
    await useFetch("/app-state/get-state", {
      baseURL: useRuntimeConfig().public.apiBase,
    })
  ).data;
export const getActiveCategories = async () =>
  (
    await useFetch("/poster/get-active-categories", {
      baseURL: useRuntimeConfig().public.apiBase,
    })
  ).data;
