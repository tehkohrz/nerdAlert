CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  userName TEXT,
  realName TEXT,
  password TEXT,
  about TEXT,
  dateJoined TEXT,
);

CREATE TABLE IF NOT EXISTS folders (
  id TEXT PRIMARY KEY;
  user_id TEXT,
  folderName TEXT
);

CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  fileName TEXT,
  codeData TEXT,
  user_id TEXT,
);

// REMOVE FOLDERS PERMISSIONS WILL BE GRANTED IN USER IDS
CREATE TABLE IF NOT EXISTS folderPermissions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  folder_id TEXT
);

CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  name TEXT,
);

CREATE TABLE IF NOT EXISTS group_user (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  group_id TEXT
);