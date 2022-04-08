import {
  getUserInfo,
  getUserId
} from "../datastore/userInfo.js";
import {
  getHash,
  getSessionHash
} from "../authentication/getHash.js"

// Login routehandler for POST not to be used to authenticate or redirect with error
// export function loginPostHandler (req, res) {
//   const {userName, password} = req.body;
//   const hashPassword = getHash(password);
//   getUserInfo(userName).then((userInfo) => {
//     console.log(userInfo);
//     console.log(hashPassword);
//   // Password is correct
//   if (hashPassword === userInfo.password) {
//     // insert session cookies for future authentication
//     res.cookie('userName', userInfo.userName);
//     const sessionHash = getSessionHash(userName);
//     res.cookie('sessionHash', sessionHash);
//     console.log('Good login');
//     res.redirect('/')
//   }
//   const navData = {loggedIn:false};
//   console.log('failed login');
//   // user not found or password incorrect stay at the login page and keep the enter pw
//   res.render('login', {userName, navData})
// });
// }

// Login routehandler for POST
export async function loginPostHandler(req, res) {
  const {
    userName,
    password
  } = req.body;
  const hashPassword = getHash(password);
  const userInfo = await getUserInfo(userName);
    // Password is correct
    if (hashPassword === userInfo.password) {
      // insert session cookies for future authentication
      res.cookie('userName', userInfo.username);
      const sessionHash = getSessionHash(userName);
      res.cookie('sessionHash', sessionHash);
      console.log('Good login');
      res.redirect('/');
    }
    else {
    const navData = {
      loggedIn: false
    };
    console.log('Login failed');
    // user not found or password incorrect stay at the login page and keep the enter pw
    res.render('login', {
      userName,
      navData
    })
  }
  };


//Login Page handler
export function loginHandler(req, res) {
  const navData = {
    loggedIn: req.isUserLoggedin
  };
  res.render('login', {
    navData
  });
}

//Log out Handler
export function logoutHandler(req, res) {
  res.clearCookie('userName');
  res.clearCookie('sessionHash');
  res.redirect('/');
}