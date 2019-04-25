const group = f => xs => xs.reduce((acc, x) => {
  const k = f(x)

  return { ...acc, [k]: [...(acc[k] || []), x] }
}, {})

export default group
