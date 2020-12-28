import EN from '@public/_locales/en/messages.json'
import ZH_CN from '@public/_locales/zh-cn/messages.json'
import KO from '@public/_locales/ko/messages.json'
import JA_JP from '@public/_locales/ja-jp/messages.json'

const locales = {
  en: EN,
  'zh-cn': ZH_CN,
  ko: KO,
  'ja-jp': JA_JP,
}

export default {
  install: function (Vue, { app }) {
    Vue.prototype.$t = function (key) {
      const locale = app.$store.state.locale
      const JSON = locales[locale]
      const JSON_FALLBACK = locales.en
      return JSON[key] ? JSON[key].message : JSON_FALLBACK[key] || key
    }
  }
}
