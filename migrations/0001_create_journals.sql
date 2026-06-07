-- 创建用户表（存储头像URL等）
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  avatar_url TEXT,
  avatar_filename TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建日志表
CREATE TABLE IF NOT EXISTS journals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_journals_timestamp ON journals(timestamp DESC);

-- 初始化用户记录（只有一条）
INSERT OR IGNORE INTO users (id, avatar_url) VALUES (1, NULL);
