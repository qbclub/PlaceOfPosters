import type { RouterConfig } from '@nuxt/schema'
import { createMemoryHistory } from 'vue-router'
// https://router.vuejs.org/api/#routeroptions
export default <RouterConfig>{
  // scrollBehavior(to, from, savedPosition) {
  //   // always scroll to top
  //   return { top: 500 }
  // },
  history: base => process.client ? createMemoryHistory(base) : null /* default */
}