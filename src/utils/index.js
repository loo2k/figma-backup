export const saveFileFromBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('download', fileName)

  // 兼容 safari
  if (typeof a.download === 'undefined') {
    a.setAttribute('target', '_blank')
  }

  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  setTimeout(() => {
    // 兼容 firefox 延迟释放
    URL.revokeObjectURL(url)
  }, 100)
}
