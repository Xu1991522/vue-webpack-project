export const downloadByOpenWindow = url => {
  const a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')

  const parent = document.body

  a.style.display = 'none'
  parent.appendChild(a)

  a.click()

  parent.removeChild(a)
}
