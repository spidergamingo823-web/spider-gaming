export function fmtDate(iso) {
  return new Date(iso).toLocaleString()
}

export function ytId(url) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/)
  return m ? m[1] : null
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
