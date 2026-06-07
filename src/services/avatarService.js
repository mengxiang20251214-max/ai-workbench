import { compressImage, blobToBase64 } from '../utils/imageCompressor'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'

// 上传头像到后端
export async function uploadAvatar(file) {
  try {
    // 压缩图片
    const compressedBlob = await compressImage(file, 2)
    const base64 = await blobToBase64(compressedBlob)

    // 发送到后端
    const formData = new FormData()
    formData.append('file', compressedBlob, 'avatar.webp')

    const response = await fetch(`${API_BASE}/api/avatar/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return { success: true, base64, ...data }
  } catch (error) {
    console.error('Avatar upload error:', error)
    throw error
  }
}

// 获取已保存的头像 URL
export async function getAvatarUrl() {
  try {
    const response = await fetch(`${API_BASE}/api/avatar`)
    if (!response.ok) throw new Error('Failed to fetch avatar')
    const data = await response.json()
    return data.avatarUrl
  } catch (error) {
    console.error('Get avatar error:', error)
    return null
  }
}
