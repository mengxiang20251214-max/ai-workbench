import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'

const Header = () => {
  const [avatar, setAvatar] = useState(null)
  const fileInputRef = useRef(null)

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatar(event.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex items-center justify-between px-8 py-6 backdrop-blur-sm bg-white/5 border-b border-white/10">
      <div className="flex items-center gap-4">
        <div className="text-3xl gradient-text font-bold">AI Workbench</div>
        <div className="text-sm text-purple-300">玻璃拟态工作台</div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => fileInputRef.current?.click()}
        className="relative w-12 h-12 rounded-full overflow-hidden glass"
      >
        {avatar ? (
          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
        )}
      </motion.button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />
    </div>
  )
}

export default Header
