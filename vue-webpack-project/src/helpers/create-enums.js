const create = (...args) => args.reduce((acc, x) => ({ ...acc, [x]: x }), {})

export default create
