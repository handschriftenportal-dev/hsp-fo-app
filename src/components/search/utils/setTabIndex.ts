export function setTabIndexHits(tabIndex: number) {
  const elements = document.getElementById('searchGrid')
  const anchorElements = elements?.querySelectorAll('a, button')
  const select = elements?.querySelector('select')

  if (anchorElements) {
    anchorElements.forEach((elem: any) => (elem.tabIndex = tabIndex))
  }
  if (select) {
    select.tabIndex = tabIndex
  }
}
