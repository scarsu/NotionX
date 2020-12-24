import EN from '@public/_locales/en/messages.json'
import ZH_CN from '@public/_locales/zh-cn/messages.json'

export default {
  install: function (Vue, { app }) {
    Vue.prototype.$t = function (key) {
      const locale = app.$store.state.locale
      const JSON = locale === 'en' ? EN : ZH_CN
      return JSON[key] ? JSON[key].message : key
    }
  }
}
