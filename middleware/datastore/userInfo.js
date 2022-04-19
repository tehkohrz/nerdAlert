import pool from './initPG.js';

function checkQuery(result) {
  if (result.rows.length < 1) {
    console.log('No entries found');
    return false;
  }
  if (result.rows.length == 1) {
    return result.rows[0];
  }
  return result.rows;
}

// GET INFORMATION

// Retrieve userId using userName stored in cookie
export async function getUserId(userName) {
  const sqlQuery = `SELECT id FROM users WHERE username = '${userName}'`;
  try {
    const result = await pool.query(sqlQuery);
    const userId = checkQuery(result);
    return userId.id;
  } catch (error) {
    console.log(error.stack);
    return error;
  }
}

// Retrieve user info based on userName
// Returns info {object} or null if not found
export async function getUserInfo(userName) {
  const sqlQuery = `SELECT * FROM users WHERE username = '${userName}'`;
  try {
    const result = await pool.query(sqlQuery);
    const userInfo = checkQuery(result);
    return userInfo;
  } catch (error) {
    console.log(error.stack);
    return error;
  }
}

// Retrieve groups that the user belong to using userName
// Returns array of matching group data
export async function getUserGroups(userName) {
  const sqlQuery = `SELECT users.id, users.username, group_user.id, group_user.user_id, group_user.group_id FROM users INNER JOIN group_user ON users.id = group_user.user_id WHERE users.username = '${userName}'`;
  try {
    const result = await pool.query(sqlQuery);
    const userGroups = checkQuery(result);
    return userGroups;
  } catch (error) {
    console.log(error.stack);
    return error;
  }
}

export async function getUserIdGroups(userId) {
  const sqlQuery = `SELECT * FROM group_user WHERE user_id = '${userId}'`;
  try {
    const result = await pool.query(sqlQuery);
    console.log("User's groups retrieved");
    const userGroups = checkQuery(result);
    return userGroups;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// Retrieve all users in a particular group given the groupname
// Returns array of all users and info that are in the group
async function usersInGroup(groupName) {
  const sqlQuery = `SELECT users.id, users.username, users.realname, groups.id, groups.name, group_user.user_id, group_user.group_id FROM groups INNER JOIN group_user ON group.id = groups_user.group_id INNER JOIN users ON user.id = group_user.user_id WHERE groups.name = '${groupName}'`;
  try {
    const result = await pool.query(sqlQuery);
    const usersInGroup = checkQuery(result);
    return usersInGroup;
  } catch (error) {
    console.log(error.stack);
    return error;
  }
}

// INSERT USER INFO

// Insert userInfo given an object of userData
export async function insertUser(userData) {
  const sqlQuery = `INSERT INTO users (id, username, realname, password, about, dateJoined) VALUES ('${userData.userId}','${userData.userName}', '${userData.realName}','${userData.hashedPassword}','${userData.about}','${userData.dateJoined}')`;
  try {
    const result = await pool.query(sqlQuery);
    return true;
  } catch (error) {
    console.log(error.stack);
    return false;
  }
}

// ALTER INFORMATION

// todo: adiitional option for password or no pw
// Update user;s profile info
export async function updateUser(userData) {
  const sqlQuery = 'UPDATE users SET username = $1, realname =$2, about=$3, password=$4 WHERE id = $5 RETURNING *;';
  const queryArray = [
    userData.username,
    userData.realname,
    userData.about,
    userData.hashedPassword,
    userData.id,
  ];
  try {
    const result = await pool.query(sqlQuery, queryArray);
    console.log('DB update completed');
    const savedInfo = checkQuery(result);
    return savedInfo;
  } catch (error) {
    console.log(error.stack);
    return false;
  }
}

// DELETE INFORMATION
