import Vue from 'vue'
import Vuex from 'vuex'
import option from './option'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locale: 'en'
  },
  mutations: {
    setLang (state, locale) {
      state.locale = locale
    }
  },
  modules: {
    option: option
  },
})
