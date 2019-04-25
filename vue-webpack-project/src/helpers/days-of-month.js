const daysOfMonth = d => {
  const date = new Date(d)
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  switch (true) {
    case [1, 3, 5, 7, 8, 10, 12].indexOf(month) > -1:
      return 31

    case [4, 6, 9, 11].indexOf(month) > -1:
      return 30

    case month === 2:
      return year % 4 === 0 && year % 100 !== 0 ? 29 : 28

    default:
      throw Error('unexpected date value:' + d)
  }
}

export default daysOfMonth
