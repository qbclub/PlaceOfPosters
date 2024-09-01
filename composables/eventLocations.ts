export const getEventLocations = async () =>
  (
    await useFetch("/event-location/get-all", {
      baseURL: useRuntimeConfig().public.apiBase,
    })
  ).data;
