export const getAppState = async () =>
  (
    await useFetch("/app-state/get-state", {
      baseURL: useRuntimeConfig().public.apiBase,
    })
  ).data;
export const getActiveCategories = async (location:string, radius:number, coordinates:[number, number]) =>
  (
    await useFetch('/poster/get-active-categories', {
      method: 'POST',  
      baseURL: useRuntimeConfig().public.apiBase,
      body: {         
        location,
        radius,
        coordinates
      },
    })
  ).data;
export const getActiveCities = async () =>
  (
    await useFetch("/poster/get-active-cities", {
      baseURL: useRuntimeConfig().public.apiBase,
    })
  ).data;
