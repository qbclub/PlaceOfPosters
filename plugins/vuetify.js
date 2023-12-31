import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
        themes: {
          light: {
            colors: {
              // background: '#F8E5E5',
              primary: '#1D1D1D',
              accent: '#ED413E',
              success: '#31BB3A',
              secondary:"#ED8F3E"
            },
          },
        },
      },
      display: {
        mobileBreakpoint: 'md',
        thresholds: {
          xs: 0,
          sm: 340,
          md: 600,
          lg: 800,
          xl: 1280,
        },
      },
  })
  app.vueApp.use(vuetify)
})
