// import axios from 'axios'
// export const API_URL = import.meta.env.VITE_API_URL
// const $api = axios.create({
//     withCredentials: true,
//     baseURL: API_URL
// })
// let filter = {
//     searchText: "",
//     date: "",
//     eventType: [],
//     eventSubtype: [],
//     posterType: "",
//     eventLocation:"",
//     coordinates:[],
//     radius:0,
//   };

// export default async () => {
//     // Fetch dynamic data from an API
//     console.log(`${process.env.NUXT_PUBLIC_API_BASE}/poster/get-all`)
//     let {data} = await $api.post(`${process.env.NUXT_PUBLIC_API_BASE}/poster/get-all`,filter); // Replace with your API endpoint
//     // Map the data to generate routes
//     const routes = data.map(item => ({
//       url: `/post?_id=${item._id}`, // Replace with your dynamic route structure
//       lastmod: item.updatedAt, // Optional: Add last modified date
//       changefreq: 'daily', // Optional: Change frequency
//       priority: 0.8, // Optional: Priority
//     }));
  
//     return routes;
//   };