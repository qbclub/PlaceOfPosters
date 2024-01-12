export default defineEventHandler(async (event) => {
    
    const token = getCookie(event, 'accessToken')
  
    return { token }
})