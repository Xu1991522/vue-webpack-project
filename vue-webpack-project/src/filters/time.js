import * as fecha from 'element-ui/lib/utils/date'

const time = (val, mask) => {
  return (
    val
      ? fecha.format(val, mask)
      : '-'
  )
}

export default time
