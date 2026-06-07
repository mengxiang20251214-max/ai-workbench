import React, { useState, useEffect } from 'react'

const LogEditor = ({ selectedLog, onSave, onAIAssist, isSaving, isLoading }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isAILoading, setIsAILoading] = useState(false)
  const [aiError, setAIError] = useState(null)

  // 当选中的日志改变时，更新编辑器内容
  useEffect(() => {
    if (selectedLog) {
      setTitle(selectedLog.title || '')
      setContent(selectedLog.content || '')
    } else {
      setTitle('')
      setContent('')
    }
    setAIError(null)
  }, [selectedLog])

  const handleSave = () => {
    if (!title.trim()) {
      alert('请输入日志标题')
      return
    }
    onSave({ title, content })
  }

  const handleAIAssist = () => {
    const instruction = window.prompt(
      '请输入你的指令（例如："帮我润色这段话"）',
      '请根据标题和已有内容，续写一段日志'
    )

    if (instruction === null) {
      // 用户点击取消
      return
    }

    callAIAssist(instruction)
  }

  const callAIAssist = async (instruction) => {
    try {
      setIsAILoading(true)
      setAIError(null)

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'

      const response = await fetch(`${apiUrl}/api/ai/assist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || '无标题',
          content: content,
          instruction: instruction,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.result) {
        // 将生成的内容追加到正文末尾
        const newContent = content
          ? `${content}\n\n${data.result}`
          : data.result

        setContent(newContent)

        // 自动保存（可选）
        // onSave({ title, content: newContent })
      } else {
        throw new Error(data.error || 'AI 生成失败')
      }
    } catch (error) {
      console.error('AI assist error:', error)
      setAIError('AI 暂时不可用，请稍后重试')
    } finally {
      setIsAILoading(false)
    }
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

        {/* 错误提示 */}
        {aiError && (
          <div className="px-8 py-3 bg-red-500/10 border-t border-red-500/20">
            <p className="text-sm text-red-600 dark:text-red-400">⚠️ {aiError}</p>
          </div>
        )}

        {/* AI 生成提示 */}
        {isAILoading && (
          <div className="px-8 py-3 bg-blue-500/10 border-t border-blue-500/20">
            <p className="text-sm text-blue-600 dark:text-blue-400">✨ AI 正在生成内容…</p>
          </div>
        )}

        {/* 底部按钮 */}
        <div className="px-8 py-6 border-t border-[var(--border-color)] flex gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving || isAILoading}
            className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:opacity-60 transition-opacity disabled:opacity-40"
          >
            {isSaving ? '保存中…' : '保存'}
          </button>

          <button
            onClick={handleAIAssist}
            disabled={isAILoading || isSaving}
            className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:opacity-60 transition-opacity disabled:opacity-40"
          >
            {isAILoading ? '✨ 生成中…' : '✨ AI 协助'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogEditor
