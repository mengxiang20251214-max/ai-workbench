import React, { useState, useEffect } from 'react'
import IconMenu from './components/IconMenu'
import LogList from './components/LogList'
import LogEditor from './components/LogEditor'

function App() {
  const [logs, setLogs] = useState([])
  const [selectedLogId, setSelectedLogId] = useState(null)
  const [activeTab, setActiveTab] = useState('logs')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    const isDark = savedTheme === 'dark'
    setIsDarkMode(isDark)
    applyTheme(isDark)
  }, [])

  // 加载日志列表
  useEffect(() => {
    loadLogs()
  }, [])

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('theme', 'light')
    }
  }

  const toggleTheme = () => {
    const newIsDark = !isDarkMode
    setIsDarkMode(newIsDark)
    applyTheme(newIsDark)
  }

  const loadLogs = async () => {
    try {
      setIsLoading(true)
      // 从本地存储加载日志
      const saved = localStorage.getItem('journals')
      if (saved) {
        const journalsList = JSON.parse(saved)
        setLogs(journalsList)
        // 自动选中第一条日志
        if (journalsList.length > 0) {
          setSelectedLogId(journalsList[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to load logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (data) => {
    if (!data.title.trim()) {
      alert('请输入日志标题')
      return
    }

    try {
      setIsSaving(true)

      const now = new Date()
      const date = now.toLocaleDateString('zh-CN')
      const timestamp = now.toISOString()

      if (selectedLogId) {
        // 更新现有日志
        const updated = logs.map(log =>
          log.id === selectedLogId
            ? { ...log, ...data, date, timestamp }
            : log
        )
        setLogs(updated)
        localStorage.setItem('journals', JSON.stringify(updated))

        // 调用后端 API 更新（如果已部署）
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
          await fetch(`${apiUrl}/api/journals/${selectedLogId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
        } catch (apiError) {
          console.error('Failed to sync update to API:', apiError)
        }
      } else {
        // 创建新日志
        const newLog = {
          id: Date.now(),
          ...data,
          date,
          timestamp,
        }
        const updated = [newLog, ...logs]
        setLogs(updated)
        setSelectedLogId(newLog.id)
        localStorage.setItem('journals', JSON.stringify(updated))

        // 调用后端 API 创建（如果已部署）
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
          await fetch(`${apiUrl}/api/journals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
        } catch (apiError) {
          console.error('Failed to sync create to API:', apiError)
        }
      }
    } catch (error) {
      console.error('Save failed:', error)
      alert('保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  const handleNewLog = () => {
    // 创建新的空日志
    const newLog = {
      id: Date.now(),
      title: '',
      content: '',
      date: new Date().toLocaleDateString('zh-CN'),
      timestamp: new Date().toISOString(),
    }
    const updated = [newLog, ...logs]
    setLogs(updated)
    setSelectedLogId(newLog.id)
    localStorage.setItem('journals', JSON.stringify(updated))
  }

  const handleDeleteLog = async (id) => {
    try {
      const updated = logs.filter(log => log.id !== id)
      setLogs(updated)
      localStorage.setItem('journals', JSON.stringify(updated))

      // 清除选择或选择下一条
      if (selectedLogId === id) {
        setSelectedLogId(updated.length > 0 ? updated[0].id : null)
      }

      // 调用后端 API 删除（如果已部署）
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
        await fetch(`${apiUrl}/api/journals/${id}`, {
          method: 'DELETE',
        })
      } catch (apiError) {
        // 本地删除成功，API 失败时的错误可以忽略（开发环境）
        console.error('Failed to sync delete to API:', apiError)
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('删除失败')
    }
  }

  const handleAIAssist = async (content) => {
    // TODO: 弹出 AI 协助对话框
    alert('AI 协助功能开发中...')
  }

  const selectedLog = logs.find(log => log.id === selectedLogId)

  return (
    <div className="w-screen h-screen flex bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* 左侧菜单 */}
      <IconMenu
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onThemeToggle={toggleTheme}
        isDarkMode={isDarkMode}
      />

      {/* 中间日志列表 */}
      {activeTab === 'logs' && (
        <LogList
          logs={logs}
          selectedLogId={selectedLogId}
          onSelectLog={setSelectedLogId}
          onNewLog={handleNewLog}
          onDeleteLog={handleDeleteLog}
        />
      )}

      {/* 右侧编辑区 */}
      {activeTab === 'logs' && (
        <LogEditor
          selectedLog={selectedLog}
          onSave={handleSave}
          onAIAssist={handleAIAssist}
          isSaving={isSaving}
          isLoading={isLoading}
        />
      )}

      {/* 标签和设置页面占位 */}
      {activeTab === 'tags' && (
        <div className="flex-1 flex items-center justify-center text-[var(--text-secondary)]">
          <p>标签功能开发中</p>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="flex-1 flex items-center justify-center text-[var(--text-secondary)]">
          <p>设置功能开发中</p>
        </div>
      )}
    </div>
  )
}

export default App
