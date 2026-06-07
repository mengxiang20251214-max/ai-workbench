import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadAvatar, getAvatarUrl } from '../services/avatarService'
import { formatFileSize } from '../utils/imageCompressor'

const Header = () => {
  const [avatar, setAvatar] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  // 加载已保存的头像
  useEffect(() => {
    loadSavedAvatar()
  }, [])

  const loadSavedAvatar = async () => {
    try {
      const url = await getAvatarUrl()
      if (url) {
        setAvatar(url)
      }
    } catch (error) {
      console.error('Failed to load avatar:', error)
    }
  }

  const handleAvatarUpload = async (file) => {
    if (!file) return

    setUploading(true)
    setUploadError(null)

    try {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file')
      }

      // 验证文件大小（上传前检查）
      const maxSizeMB = 10 // 上传前最大 10MB，压缩后 2MB
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`File too large (max ${maxSizeMB}MB)`)
      }

      const result = await uploadAvatar(file)

      if (result.success) {
        // 使用 base64 作为临时预览
        setAvatar(result.base64)
        setUploadError(null)
      }
    } catch (error) {
      setUploadError(error.message || 'Upload failed')
      console.error('Avatar upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleAvatarUpload(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) handleAvatarUpload(file)
  }

  return (
    <div className="flex items-center justify-between px-8 py-6 backdrop-blur-sm bg-white/5 border-b border-white/10">
      <div className="flex items-center gap-4">
        <div className="text-3xl gradient-text font-bold">AI Workbench</div>
        <div className="text-sm text-purple-300">玻璃拟态工作台</div>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className="relative"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`relative w-12 h-12 rounded-full overflow-hidden glass transition-all ${
            dragActive ? 'ring-2 ring-cyan-400 scale-110' : ''
          } ${uploading ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
        >
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full"
              />
            </div>
          )}

          {avatar && !uploading && (
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          )}

          {!avatar && !uploading && (
            <div className="w-full h-full flex items-center justify-center text-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              👤
            </div>
          )}
        </motion.button>

        {dragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400 pointer-events-none"
          />
        )}
      </div>

      {/* 错误提示 */}
      <AnimatePresence>
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 right-8 bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-2 rounded-lg text-sm max-w-xs"
          >
            {uploadError}
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        disabled={uploading}
        className="hidden"
      />
    </div>
  )
}

export default Header
