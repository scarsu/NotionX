import Vue from 'vue'
import App from './App.vue'
import store from '@/store'
import i18n from '@/utils/i18n'

/* eslint-disable no-new */
const app = new Vue({
  store,
  render: (h) => h(App),
})

Vue.use(i18n, { app })

app.$mount('#app')
export default app
