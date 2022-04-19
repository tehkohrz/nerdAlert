CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  userName TEXT,
  realName TEXT,
  password TEXT,
  about TEXT,
  dateJoined TEXT
);

CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  fileName TEXT,
  codeData TEXT,
  user_id TEXT
);

CREATE TABLE IF NOT EXISTS filePermissions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  file_id TEXT
);

CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  name TEXT
);

CREATE TABLE IF NOT EXISTS group_user (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  group_id TEXT
);

CREATE TABLE IF NOT EXISTS sharedcode (
  id TEXT PRIMARY KEY,
  fileName TEXT,
  codeData TEXT,
  date TEXT
);