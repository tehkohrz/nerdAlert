import { getSessionHash } from "./getHash.js";
import { getUserId } from "../datastore/userInfo.js";

// Middleware to authenticate session based on the username
// Default output is cookie.isLoggedIn = false

export async function checkSession(req, res, next) {
  // default false login
  req.isUserLoggedIn = false;
  // Check for required cookie values for session authentication
  if (req.cookies.sessionHash && req.cookies.userName) {
    const sessionHash = req.cookies.sessionHash;
    const user = req.cookies.userName;
    // Checking userName + SALT against sessionHash stored in cookies
    const hashed = getSessionHash(user);
    if (hashed === sessionHash) {
      req.userId = await getUserId(user);
      req.isUserLoggedIn = true;
    }
  }
  next();
}