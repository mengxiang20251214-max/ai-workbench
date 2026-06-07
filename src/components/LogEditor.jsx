import React, { useState, useEffect } from 'react'

const LogEditor = ({ selectedLog, onSave, onAIAssist, isSaving, isLoading }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // 当选中的日志改变时，更新编辑器内容
  useEffect(() => {
    if (selectedLog) {
      setTitle(selectedLog.title || '')
      setContent(selectedLog.content || '')
    } else {
      setTitle('')
      setContent('')
    }
  }, [selectedLog])

  const handleSave = () => {
    if (!title.trim()) {
      alert('请输入日志标题')
      return
    }
    onSave({ title, content })
  }

  const handleAIAssist = () => {
    onAIAssist(content)
  }

  const formatDate = (dateString) => {
    if (!dateString) {
      const now = new Date()
      dateString = now.toISOString()
    }

    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    const weekday = weekdays[date.getDay()]

    return `${year}年${month}月${day}日 ${weekday}`
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-[var(--bg-primary)]">
      {/* 顶部日期 */}
      <div className="px-8 py-6 border-b border-[var(--border-color)]">
        <p className="text-sm text-[var(--text-secondary)]">
          {formatDate(selectedLog?.timestamp)}
        </p>
      </div>

      {/* 编辑区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 标题输入框 */}
        <div className="px-8 pt-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="日志标题…"
            className="w-full text-3xl font-semibold bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
          />
        </div>

        {/* 正文输入框 */}
        <div className="flex-1 flex flex-col px-8 pt-4 overflow-hidden">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="开始写作…"
            className="flex-1 resize-none text-base bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
          />
        </div>

        {/* 底部按钮 */}
        <div className="px-8 py-6 border-t border-[var(--border-color)] flex gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:opacity-60 transition-opacity disabled:opacity-40"
          >
            {isSaving ? '保存中…' : '保存'}
          </button>

          <button
            onClick={handleAIAssist}
            disabled={isLoading || !content.trim()}
            className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:opacity-60 transition-opacity disabled:opacity-40"
          >
            ✨ AI 协助
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogEditor
