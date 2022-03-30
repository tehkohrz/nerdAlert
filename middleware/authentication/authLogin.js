import { getHash } from "./getHash";

// Login middleware to be used to authenticate or redirect with error
export function checkPassword (req, res, next) {
  const {userName, password} = req.body;
  const sqlQuery = `SELECT * FROM users WHERE user_name = ${userName}`
}