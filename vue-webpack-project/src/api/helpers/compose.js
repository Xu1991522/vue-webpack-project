
const compose = (...fns) => fns.reduce((a, b) => (...args) => a(b(...args)), x => x)

export default compose
