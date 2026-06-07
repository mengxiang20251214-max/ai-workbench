import React from 'react'

const LogList = ({ logs, selectedLogId, onSelectLog, onNewLog, onDeleteLog }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${month}/${day}`
    } catch {
      return dateString
    }
  }

  return (
    <div className="w-80 h-screen flex flex-col border-r border-[var(--border-color)] bg-[var(--bg-primary)]">
      {/* 顶部 - 新建日志按钮 */}
      <div className="p-4 border-b border-[var(--border-color)]">
        <button
          onClick={onNewLog}
          className="w-full py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          + 新建日志
        </button>
      </div>

      {/* 日志列表 */}
      <div className="flex-1 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="p-4 text-sm text-[var(--text-tertiary)]">
            暂无日志
          </div>
        ) : (
          logs.map((log) => {
            const isSelected = log.id === selectedLogId
            return (
              <div
                key={log.id}
                onClick={() => onSelectLog(log.id)}
                className={`px-4 py-3 border-l-2 cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-l-[var(--active-line)] bg-[var(--hover-bg)]'
                    : 'border-l-transparent hover:bg-[var(--hover-bg)]'
                }`}
              >
                {/* 日期 + 标题 */}
                <div className="flex gap-3 items-start">
                  <span className="text-xs text-[var(--text-tertiary)] flex-shrink-0 mt-0.5">
                    {formatDate(log.timestamp)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm truncate ${
                        isSelected ? 'font-semibold' : 'font-normal'
                      } text-[var(--text-primary)]`}
                    >
                      {log.title || '无标题'}
                    </h3>
                    {log.content && (
                      <p className="text-xs text-[var(--text-tertiary)] mt-1 line-clamp-1">
                        {log.content}
                      </p>
                    )}
                  </div>
                </div>

                {/* 悬停时显示删除按钮 */}
                <div className="group absolute right-4 top-3 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteLog(log.id)
                    }}
                    className="text-xs text-[var(--text-tertiary)] hover:text-red-500 transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default LogList
