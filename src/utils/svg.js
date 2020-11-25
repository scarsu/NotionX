const requireAll = (requireContext) => requireContext.keys().map(requireContext)
const req = require.context('../assets/svg', true, /\.svg$/)
requireAll(req)
