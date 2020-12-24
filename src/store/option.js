import { EXTENSION_STORAGE_OPTION_KEY, ORIGIN_OPTIONS } from '@/utils/constant'
import Actions from '@/utils/Actions'

// 深拷贝
const options = ORIGIN_OPTIONS.map(e => {
  return { ...e }
})

// types: switch select slider input color-picker
export default {
  state: () => ({
    items: options
  }),
  mutations: {
    updateOption (state, { option }) {
      const i = state.items.findIndex(o => o.action === option.action)
      if (i > -1) {
        // 只允许变更部分字段
        state.items[i].value = option.value
        state.items[i].hide = option.hide
      }

      window.localStorage.setItem(EXTENSION_STORAGE_OPTION_KEY, JSON.stringify(state.items))
    },
    updateOptions (state, { options, needEffect = false }) {
      options.forEach(e => {
        const i = state.items.findIndex(o => o.action === e.action)
        if (i > -1) {
          // 只允许变更部分字段
          state.items[i].value = e.value
          state.items[i].hide = e.hide
        }
      })

      window.localStorage.setItem(EXTENSION_STORAGE_OPTION_KEY, JSON.stringify(state.items))

      if (needEffect) {
        console.log('this:', this)
        state.items.forEach(item => handleOption.call(this, item))
      }
    }
  },
  actions: {

  },
  getters: {

  }
}

/**
 * 单个配置处理
 * @param {*} option 配置项
 * @param {*} event 触发事件
 */
export function handleOption (option, event) {
  console.log('this:', this)
  // 更新option值
  if (event) {
    if (option.type === 'switch') {
      option.value = !option.value
    } else if (option.type === 'select') {
      option.value = event.currentTarget.value
    }
    this.$store.commit('updateOption', { option })
  }

  // 执行命令,传递event
  const para = {
    ...option,
    event
  }
  if (option.scope === 'content') {
    contentAction(para)
  } else if (option.scope === 'popup') {
    Actions[option.action].call(this, para)
  } else if (option.scope === 'all') {
    Actions[option.action].call(this, para)
  }
}

/**
 * 向content传递消息(当前active的tab
 * @param {*} option 需要而护短处理的配置项
 */
export function contentAction (option) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'action',
      data: option
    }, function (response) {
      if (response && response.success) {
        console.log(response.message)
      } else {
        console.warn('NotionX - popup : ', '连接失败')
      }
    })
  })
}
