import { getHash } from "./getHash";
import { getUserId } from "../datastore/userInfo";
import dotenv from 'dotenv';
dotenv.config();

// Middleware to authenticate session or password hash depending on the presence of sessionhash
const SALT = process.env.SECRETSALT;

export function checkHash(req, res, next) {
  // default false login
  req.isUserLoggedIn = false;
  const sessionHash = req.cookies.sessionHash;
  const user = req.cookies.userName;
  // Check for required cookie values for session authentication
  if (sessionHash && user) {
    // Checking userName + SALT against sessionHash stored in cookies
    const sessionString = user + SALT;
    const hashed = getHash(sessionString);
    if (hashed === sessionHash) {
      req.userId = getUserId(user);
      req.isUserLoggedIn = true;
    }
    next();
  }
  // Cookies values not present or authentication failed redirect to login
  res.redirect('/login');
}