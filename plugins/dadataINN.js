export default defineNuxtPlugin(  async function getPossiblePartner(value) {

    var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party";

    var options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Token ${import.meta.env.VITE_DADATA_TOKEN}`
        },
        body: JSON.stringify({
            query: value

        })
    }

    let res = await fetch(url, options)

    try {
        let suggestions = JSON.parse(await res.text()).suggestions
        return suggestions.map(s => ({
            partner: s,

        }))
    } catch (error) {
        console.log(error);
    }

})