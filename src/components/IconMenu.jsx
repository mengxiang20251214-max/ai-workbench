import React, { useState, useEffect } from 'react'

const IconMenu = ({ activeTab, onTabChange, onThemeToggle, isDarkMode }) => {
  const menuItems = [
    { id: 'logs', icon: '📝', label: '日志' },
    { id: 'tags', icon: '🏷️', label: '标签' },
    { id: 'settings', icon: '⚙️', label: '设置' },
  ]

  return (
    <div className="w-18 h-screen flex flex-col items-center py-6 border-r border-[var(--border-color)]">
      {/* 主题切换按钮 */}
      <button
        onClick={onThemeToggle}
        className="mb-8 text-2xl hover:opacity-60 transition-opacity"
        title={isDarkMode ? '切换为亮色模式' : '切换为暗色模式'}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* 菜单项 */}
      <div className="flex flex-col gap-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`text-3xl transition-opacity ${
              activeTab === item.id ? 'opacity-100' : 'opacity-40 hover:opacity-60'
            }`}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* 底部占位 */}
      <div className="flex-1" />
    </div>
  )
}

export default IconMenu
