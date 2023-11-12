 function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function newNumber () {
    return getRandomInt (1, 1000000000)
}
export default  defineNuxtPlugin(newNumber)