import React, { useState } from 'react'
import { motion } from 'framer-motion'

const JournalForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim() && content.trim()) {
      onSubmit(title, content)
      setTitle('')
      setContent('')
    }
  }

  const handleAISummary = () => {
    // TODO: 连接到 AI 功能
    alert('AI 功能开发中...')
  }

  return (
    <form onSubmit={handleSubmit} className="glass p-8 h-full flex flex-col">
      <h2 className="text-2xl gradient-text font-bold mb-6">写日志</h2>

      <div className="flex-1 flex flex-col gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入日志标题..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-colors"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <label className="block text-sm text-gray-300 mb-2">内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="输入日志内容..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-colors resize-none"
          />
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
          >
            {loading ? '保存中...' : '保存'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleAISummary}
            className="flex-1 border border-cyan-400/50 text-cyan-300 font-semibold py-2 rounded-lg hover:bg-cyan-400/10 transition-all"
          >
            ✨ AI 帮我写
          </motion.button>
        </div>
      </div>
    </form>
  )
}

export default JournalForm
