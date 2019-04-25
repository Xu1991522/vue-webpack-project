import compose from './compose'

export const flatten = services => {
  const f = (group, label) => {
    return Object.keys(group).reduce((acc, x) => {
      const val = group[x]

      return {
        ...acc,
        ...(typeof val !== 'object' ? { [label + x]: val } : f(val, label + x + '.'))
      }
    }, {})
  }

  return f(services, '')
}

export const extract = obj => {
  const res = {}

  Object.keys(obj).forEach(action => {
    const path = action.split('.')

    const l = path.length
    let i = 0
    let v = res

    while (i < l - 1) {
      const p = path[i]
      !v[p] && (v[p] = {})
      v = v[p]

      i++
    }

    v[path[l - 1]] = obj[action]
  })

  return res
}

export const enhance = (...fns) => actions => {
  return Object.keys(actions).reduce((acc, x) => ({ ...acc, [x]: compose(...fns.map(f => f(x, actions[x])))(actions[x]) }), {})
}

const generage = (services) => {
  const actions = flatten(services)

  const api = extract(actions)

  api.use = (...fns) => {
    // eval hack
    // with side effect
    Object.assign(api, extract(enhance(...fns)(actions)))
  }

  return api
}

export default generage
