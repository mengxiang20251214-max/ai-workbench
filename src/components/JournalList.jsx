import React from 'react'
import { motion } from 'framer-motion'

const JournalList = ({ journals, onDelete }) => {
  return (
    <div className="glass p-6 h-full flex flex-col">
      <h2 className="text-xl gradient-text font-bold mb-4">日志列表</h2>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {journals.length === 0 ? (
          <div className="text-gray-400 text-center py-8">还没有日志呢</div>
        ) : (
          journals.map((journal, idx) => (
            <motion.div
              key={journal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass p-3 cursor-pointer hover:border-cyan-400/50 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {journal.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{journal.date}</p>
                </div>
                <button
                  onClick={() => onDelete(journal.id)}
                  className="ml-2 text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  删除
                </button>
              </div>
              <p className="text-xs text-gray-300 mt-2 line-clamp-2">
                {journal.content}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default JournalList
