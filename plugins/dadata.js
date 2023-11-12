export default defineNuxtPlugin( async function getPossibleLocations(value) {
    if (value.trim().length < 3)
        return

    var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

    var options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Token ${import.meta.env.VITE_DADATA_TOKEN}`
        },
        body: JSON.stringify({
            query: value,
            count: 10,
            "from_bound": { "value": "city" },
            "to_bound": { "value": "house" }
        })
    }

    let res = await fetch(url, options)

    try {
        let suggestions = JSON.parse(await res.text()).suggestions
      

        //         city_with_type : "г Глазов"
        //         region_with_type: "Удмуртская Респ"
        return suggestions.map(s => ({
            name: s.value,

            // dont remove name duplication 
            geo: {
                name: s.value,
                geo_lat: s.data.geo_lat,
                geo_lon: s.data.geo_lon,
                city_with_type: s.data.city_with_type,
                settlement_with_type: s.data.settlement_with_type,
                region_with_type: s.data.region_with_type,
                area_with_type: s.data.area_with_type,
                capital_marker:s.data.capital_marker
            }

        }))
    } catch (error) {
        console.log(error);
    }
})