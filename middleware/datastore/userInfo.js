import pool from './initPG.js';

function queryError(result) {
  if (result.rows.length < 1) {
    console.log('No entries found');
    return null;
  }
}

// GET INFORMATION

// Retrieve userId using userName stored in cookie
export function getUserId(userName) {
  const sqlQuery = `SELECT id FROM users WHERE user_name = ${userName}`;
  const result = async () => {
    pool.query(sqlQuery);
    try {
      const userId = result.rows[0];
      return userId;
    } catch (error) {
      console.log(error.stack);
      return queryError(result);
    }
  };
}
// Retrieve user info based on userName
// Returns info {object} or null if not found
export function getUserInfo(userName) {
  const sqlQuery = `SELECT * FROM users WHERE user_name = ${userName}`;
  const result = async () => {
    pool.query(sqlQuery);
    try {
      const userInfo = result.rows[0];
      return userInfo;
    } catch (error) {
      console.log(error.stack);
      return queryError(result);
    }
  };
}
// Retrieve groups that the user belong to using userName
// Returns array of matching group data
export function getUserGroups(userName) {
  const sqlQuery = `SELECT users.id, users.userName, groups.id, groups.id, groups.user_id FROM users INNER JOIN groups ON users.id = groups.user_id WHERE user.userName = ${userName}`;
  const result = async () => {
    pool.query(sqlQuery);
    try {
      const userGroups = result.rows;
      return userGroups;
    } catch (error) {
      console.log(error.stack);
      return queryError(result);
    }
  };
}

export function getUserIdGroups(userId) {
  const sqlQuery = `SELECT * FROM groups WHERE user_id = ${userId}`;
  const result = async () => {
    pool.query(sqlQuery);
    try {
      const userGroups = result.rows;
      return userGroups;
    } catch (error) {
      console.log(error.stack);
      return queryError(result);
    }
  };
}

// Retrieve all users in a particular group given the groupname
// Returns array of all users and info that are in the group
function usersInGroup(groupName) {
  const sqlQuery = `SELECT users.id, users.userName, users.realName, groups.id, groups.name, group_user.user_id, group_user.group_id FROM groups INNER JOIN group_user ON group.id = groups_user.group_id INNER JOIN users ON user.id = group_user.user_id WHERE group.name = ${groupName}`;
  const result = async () => {
    pool.query(sqlQuery);
    try {
      const usersInGroup = result.rows;
      return usersInGroup;
    } catch (error) {
      console.log(error.stack);
      return queryError(result);
    }
  }
}
// ALTER INFORMATION

// DELETE INFORMATION