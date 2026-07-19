const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
import { compressImages } from './imageCompress'

async function uploadOneFile(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Missing Cloudinary environment variables')
  }
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'njugush-mitumba')
  const url = "https://api.cloudinary.com/v1_1/" + CLOUD_NAME + "/image/upload"
  const response = await fetch(url, { method: 'POST', body: formData })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Upload failed')
  }
  const data = await response.json()
  return data.secure_url
}

export async function uploadMultipleToCloudinary(files, maxWidth, quality) {
  const compressed = await compressImages(files, maxWidth || 800, quality || 0.6)
  const results = []
  for (let i = 0; i < compressed.length; i++) {
    results.push(uploadOneFile(compressed[i]))
    if (i < compressed.length - 1) await new Promise(r => setTimeout(r, 300))
  }
  return Promise.all(results)
}

export async function uploadToCloudinary(file) {
  return uploadOneFile(file)
}