const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('../asset/svg', true, /\.svg$/)
requireAll(req)
