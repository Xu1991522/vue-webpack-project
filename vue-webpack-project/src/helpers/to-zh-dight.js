const toZhDigit = (digit) => {
  const texts = {
    0: '零',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '七',
    8: '八',
    9: '九',
    10: '十'
  }

  if (digit < 10) {
    return texts[digit]
  }

  const [a, b] = [Math.floor(digit / 10000), digit % 10000]
  const [c, d] = [Math.floor(b / 1000), b % 1000]
  const [e, f] = [Math.floor(d / 100), d % 100]
  const [g, h] = [Math.floor(f / 10), f % 10]

  const str = (a > 10000 ? toZhDigit(Math.floor(a / 10000)) + '亿' + (a % 10000 > 1000 ? '' : '零') + toZhDigit(a % 10000) + '万' : toZhDigit(a) + '万') + (texts[c] + '千') + (texts[e] + '百') + (texts[g] + '十') + texts[h]

  return str.replace(/零万|零千|零百|零十/g, '零').replace(/^零+/, '').replace(/零+$/, '').replace(/零+/g, '零').replace('万万', '亿').replace(/^一十/, '十')
}

export default toZhDigit
