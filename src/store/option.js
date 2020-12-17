// types: switch select slider input color-picker

export default {
  state: () => ({
    items: [
      {
        name: 'Hide Page Comment', // 配置项名称
        desc: '隐藏页面评论', // 配置项描述
        func: hideComments, // 处理函数
        value: false, // 值
        type: 'switch', // 配置类型
        hide: false, // 不再显示此配置项
      },
      {
        name: 'Hide Toc Button',
        desc: '隐藏Toc按钮',
        func: hideToc,
        value: false,
        type: 'switch',
        hide: false,
      }
    ]
  }),
  mutations: {

  },
  actions: {

  },
  getters: {

  }
}

function hideComments () {
  document.querySelector('#notionx-sidebar-btn').style.display = 'none'
  console.log('hideComments')
}
function hideToc () {
  console.log('hideToc')
}
