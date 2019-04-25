const operator = val => {
  const operators = {
    CMCC: '中国移动',
    UNICOM: '中国联通',
    CNET: '中国电信'
  }

  return operators[val] || val
}

export default operator
