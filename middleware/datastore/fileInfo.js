import sqlString from 'sqlstring';
import pool from './initPG.js';

function checkQuery(result) {
  if (result.rows.length < 1) {
    console.log('No entries found');
    return false;
  }
  // if (result.rows.length == 1) {
  //   return result.rows[0];
  // }
  return result.rows;
}

// GET

// Retrieve file using fileId
export async function getCodeFile(id) {
  const sqlQuery = `SELECT * FROM files where id ='${id}'`;
  try {
    const result = await pool.query(sqlQuery);
    const file = checkQuery(result);
    return file;
  } catch (error) {
    console.log(error.stack);
    return error;
  }
}

// Retrieve files owned or created by the user
// Consider removing the extra cols that are not required
async function getUserFiles(userName) {
  const sqlQuery = `SELECT users.id, users.userName, files.fileName, files.id, files.user_id 
  FROM files 
  INNER JOIN users ON users.id = files.user_id 
  WHERE users.userName = ${userName}`;
  try {
    const result = await pool.query(sqlQuery);
    const files = checkQuery(result);
    return files;
  } catch (error) {
    console.log(error.stack);
    return error;
  }
}

// Using userId for the query
export async function getUserIdFiles(userId) {
  const sqlQuery = `SELECT * 
  FROM files 
  WHERE user_id = '${userId}'`;
  try {
    const result = await pool.query(sqlQuery);
    console.log('User file retrieved');
    const files = checkQuery(result);
    return files;
  } catch (error) {
    console.log(error.stack);
    return error;
  }
}

// DONT NEED THIS
// Retrieve folders owned by the user
async function getUserFolders(userName) {
  const sqlQuery = `SELECT users.id, users.userName, folders.folderName, folders.user_id 
  FROM folders 
  INNER JOIN users ON users.id = folders.user_id 
  WHERE users.userName = ${userName}`;
  try {
    const result = await pool.query(sqlQuery);
    const folders = checkQuery(result);
    return folders;
  } catch (error) {
    console.log(error.stack);
    return error;
  }
}

// Retrieve all files in the folder
async function getFilesInFolder(folderName) {
  const sqlQuery = `SELECT folders.folderName, folders.id, files.id, files.fileName, files.folder_id 
  FROM folders 
  INNER JOIN files ON files.folder_id = folders.id 
  WHERE folders.folderName = ${folderName}`;
  try {
    const result = await pool.query(sqlQuery);
    const files = checkQuery(result);
    return files;
  } catch (error) {
    console.log(error.stack);
    return error;
  }
}

// Retrieve permission for a particular file given userId and fileId
// Find file -> folder -> permissions -> userid
async function getFilePermission(userId, fileId) {
  const sqlQuery = `SELECT files.id, files.folder_id, folders.id, users.id, folderPermissions.user_id, folderPermission.folder_id 
  FROM files 
  INNER JOIN folders ON files.folder_id = folders.id 
  INNER JOIN folderPermissions ON folderPermission.folder_id = folder.id 
  WHERE (folderPermissions.user_id = ${userId} AND files.id = ${fileId})`;
  try {
    const result = await pool.query(sqlQuery);
    const files = checkQuery(result);
    return files;
  } catch (error) {
    console.log(error.stack);
    return error;
  }
}

// INSERT

// save code into database
export async function saveCode(codeData) {
  const sqlQuery = `INSERT INTO files ( 
  id,
  fileName,
  codeData,
  user_id) VALUES (
  '${codeData.id}',
  '${codeData.fileName}',
  '${codeData.data}',
  '${codeData.userId}') `;
  try {
    const result = await pool.query(sqlQuery);
    console.log('Save code success!');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// Insert permissions into the filePermissions db
export async function insertPermission(codeData) {
  const sqlQuery = `INSERT INTO filePermissions (id, user_id, file_id) VALUES ('${codeData.permissionId}', '${codeData.userId}', '${codeData.id}')`;
  try {
    const result = await pool.query(sqlQuery);
    console.log('Inserted Permissions');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// UPDATE

export async function updateCode(codeData) {
  const sqlQuery = 'UPDATE files SET codedata =$1, filename = $2 WHERE id = $3';
  const queryArray = [codeData.codeData, codeData.fileName, codeData.id];
  try {
    const result = await pool.query(sqlQuery, queryArray);
    console.log(`File ${codeData.fileName} Updated`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// DELETE
export async function deleteCode(codeId, userId) {
  const sqlQuery = `DELETE FROM files WHERE id = ${sqlString.escape(codeId)} AND user_id = ${sqlString.escape(userId)}`;
  console.log({ sqlQuery });
  try {
    const result = await pool.query(sqlQuery);
    console.log('File was deleted');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deletePermissions(codeId) {
  const sqlQuery = `DELETE FROM filePermissions WHERE file_id = ${sqlString.escape(codeId)}`;
  console.log({ sqlQuery });
  try {
    const result = await pool.query(sqlQuery);
    console.log('File permissions was deleted');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// Share CODE update db
export async function updateIntoTemp(codeData, newFile) {
  // If it is a new file
  if (newFile) {
    const sqlQuery = `INSERT INTO sharedcode (id, codedata, filename, date) VALUES (${sqlString.escape(codeData.shareId)},'${codeData.codeSaver}', ${sqlString.escape(codeData.fileName)},'${codeData.date}')`;
    try {
      const result = await pool.query(sqlQuery);
      console.log('File inserted into temp db.');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  } else {
    // if file was found in the db then update it (only when still in the same session)
    const sqlQuery = `UPDATE sharedcode SET codedata = '${codeData.codeSaver}', filename =${sqlString.escape(codeData.fileName)}, date = '${codeData.date}' WHERE id = ${sqlString.escape(codeData.shareId)}`;
    try {
      const result = await pool.query(sqlQuery);
      console.log('File update in temp db.');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

// Check if file exist in the temp db
export async function checkTempFile(id) {
  const sqlQuery = `SELECT * FROM sharedcode where id ='${id}'`;
  try {
    const result = await pool.query(sqlQuery);
    // if there is a result return newfile = false
    if (result.rows.length > 0) {
      console.log('temp identified');
      return false;
    }
    return true;
  } catch (error) {
    console.log(error.stack);
    return false;
  }
}
// Get temp file data
export async function getTempFile(id) {
  const sqlQuery = `SELECT * FROM sharedcode where id ='${id}'`;
  try {
    const result = await pool.query(sqlQuery);
    console.log('temp identified');
    const tempFile = checkQuery(result);
    return tempFile;
    return false;
  } catch (error) {
    console.log(error.stack);
    return false;
  }
}
