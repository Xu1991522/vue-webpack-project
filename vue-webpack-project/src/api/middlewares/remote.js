import request from '../helpers/request'

export default prefix => (action, suffix) => next => (...params) =>
  request(prefix + suffix, ...params)
