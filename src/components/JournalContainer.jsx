import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import JournalList from './JournalList'
import JournalForm from './JournalForm'

const JournalContainer = () => {
  const [journals, setJournals] = useState([])
  const [loading, setLoading] = useState(false)

  // 从本地存储加载日志（临时方案，后面连接 D1）
  useEffect(() => {
    const saved = localStorage.getItem('journals')
    if (saved) {
      setJournals(JSON.parse(saved))
    }
  }, [])

  // 保存日志到本地存储
  const saveJournals = (data) => {
    localStorage.setItem('journals', JSON.stringify(data))
  }

  const addJournal = (title, content) => {
    const newJournal = {
      id: Date.now(),
      title,
      content,
      date: new Date().toLocaleDateString('zh-CN'),
      timestamp: new Date().toISOString(),
    }
    const updated = [newJournal, ...journals]
    setJournals(updated)
    saveJournals(updated)
  }

  const deleteJournal = (id) => {
    const updated = journals.filter(j => j.id !== id)
    setJournals(updated)
    saveJournals(updated)
  }

  return (
    <div className="flex-1 overflow-hidden flex p-8 gap-6">
      {/* 左侧日志列表 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-96 overflow-y-auto"
      >
        <JournalList journals={journals} onDelete={deleteJournal} />
      </motion.div>

      {/* 右侧写日志表单 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1"
      >
        <JournalForm onSubmit={addJournal} loading={loading} />
      </motion.div>
    </div>
  )
}

export default JournalContainer
