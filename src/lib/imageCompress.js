export async function compressImage(file, maxWidth = 800, quality = 0.6) {
  return new Promise((resolve) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = function () {
      let w = img.width, h = img.height
      if (w > maxWidth) {
        h = Math.round((maxWidth / w) * h)
        w = maxWidth
      }
      canvas.width = w
      canvas.height = h
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/webp', lastModified: Date.now() }))
          } else { resolve(file) }
        },
        'image/webp',
        quality
      )
    }
    img.onerror = function () { resolve(file) }
    img.src = URL.createObjectURL(file)
  })
}

export async function compressImages(files, maxWidth, quality) {
  return Promise.all(files.map(f => compressImage(f, maxWidth, quality)))
}