const requireAll = (requireContext) => requireContext.keys().map(requireContext)
// 指定svg文件
const r = require.context('./', false, /.svg$/)
requireAll(r)

// 在src/main.js中引入此文件
// import '@/assets/icon'
