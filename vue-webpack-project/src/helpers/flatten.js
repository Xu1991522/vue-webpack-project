const flatten = xs => xs.reduce((acc, x) => [...acc, ...x], [])

export default flatten
