export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'accessToken')

    setCookie(event, 'accessToken', token)

    return { token }
})