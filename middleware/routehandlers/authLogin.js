import { getUserInfo } from "../datastore/userInfo";
import {getHash, getSessionHash} from "getHash.js"


// Login routehandler for POST not to be used to authenticate or redirect with error
export function checkPassword (req, res) {
  const {userName, password} = req.body;
  const userInfo = getUserInfo(userName);
  const hashPassword = getHash(password);
  // Password is correct
  if (hashPassword === userInfo.password) {
    // insert session cookies for future authentication
    res.cookie('userName', userInfo.userName);
    const sessionHash = getSessionHash(userName);
    res.cookie('sessionHash', sessionHash);
    res.redirect('/')
  }
  // user not found or password incorrect stay at the login page and keep the enter pw
  res.render('login', {user})
}