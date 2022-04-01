import { getSessionHash } from "./getHash";
import { getUserId } from "../datastore/userInfo";

// Middleware to authenticate session based on the username
// Default output is cookie.isLoggedIn = false

export function checkHash(req, res, next) {
  // default false login
  req.isUserLoggedIn = false;
  const sessionHash = req.cookies.sessionHash;
  const user = req.cookies.userName;
  // Check for required cookie values for session authentication
  if (sessionHash && user) {
    // Checking userName + SALT against sessionHash stored in cookies
    const sessionHash = getSessionHash(user);
    if (hashed === sessionHash) {
      req.userId = getUserId(user);
      req.isUserLoggedIn = true;
    }
  }
  next();
  // Cookies values not present or authentication failed redirect to login
  // Redirect should be
  // res.redirect('/login');
}