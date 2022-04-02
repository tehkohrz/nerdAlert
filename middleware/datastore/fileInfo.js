import pool from './initPG';

function queryError(result) {
  if (result.rows.length < 1) {
    console.log('No entries found');
    return null;
  }
}

// Retrieve files owned or created by the user
// Consider removing the extra cols that are not required
function getUserFiles(userName) {
  const sqlQuery = `SELECT users.id, users.userName, files.fileName, files.id, files.user_id 
  FROM files 
  INNER JOIN users ON users.id = files.user_id 
  WHERE users.userName = ${userName}`;
  const result = async () => {
    pool.query(sqlQuery);
    try {
      const files = result.rows;
      return files;
    } catch (error) {
      console.log(error.stack);
      return queryError(result);
    }
  }
}

// Using userId for the query
export function getUserIdFiles(userId) {
  const sqlQuery = `SELECT * 
  FROM files 
  WHERE user_id = ${userId}`;
  const result = async () => {
    pool.query(sqlQuery);
    try {
      const files = result.rows;
      return files;
    } catch (error) {
      console.log(error.stack);
      return queryError(result);
    }
  }
}

// DONT NEED THIS
// Retrieve folders owned by the user
function getUserFolders(userName) {
  const sqlQuery = `SELECT users.id, users.userName, folders.folderName, folders.user_id 
  FROM folders 
  INNER JOIN users ON users.id = folders.user_id 
  WHERE users.userName = ${userName}`;
  const result = async () => {
    pool.query(sqlQuery);
    try {
      const folders = result.rows;
      return folders;
    } catch (error) {
      console.log(error.stack);
      return queryError(result);
    }
  }
}

// Retrieve all files in the folder
function getFilesInFolder(folderName) {
  const sqlQuery = `SELECT folders.folderName, folders.id, files.id, files.fileName, files.folder_id 
  FROM folders 
  INNER JOIN files ON files.folder_id = folders.id 
  WHERE folders.folderName = ${folderName}`;
  const result = async () => {
    pool.query(sqlQuery);
    try {
      const files = result.rows;
      return files;
    } catch (error) {
      console.log(error.stack);
      return queryError(result);
    }
  }
}

// Retrieve permission for a particular file given userId and fileId
// Find file -> folder -> permissions -> userid
function getFilePermission(userId, fileId) {
  const sqlQuery = `SELECT files.id, files.folder_id, folders.id, users.id, folderPermissions.user_id, folderPermission.folder_id 
  FROM files 
  INNER JOIN folders ON files.folder_id = folders.id 
  INNER JOIN folderPermissions ON folderPermission.folder_id = folder.id 
  WHERE (folderPermissions.user_id = ${userId} AND files.id = ${fileId})`;
  const result = async () => {
    pool.query(sqlQuery);
    try {
      const files = result.rows;
      return files;
    } catch (error) {
      console.log(error.stack);
      return queryError(result);
    }
  }
}