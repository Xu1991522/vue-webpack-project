const app = 'IOT'

const extract = key => {
  const id = `${app}@@${key}`

  const get = () => {
    return JSON.parse(localStorage.getItem(id) || '{}')
  }
  const set = (val) => {
    localStorage.setItem(id, JSON.stringify(val))
  }

  const pull = get
  const push = set
  const merge = (k, v) => {
    set({ ...get(), [k]: v })
  }

  return {
    pull,
    push,
    merge
  }
}

export default extract
