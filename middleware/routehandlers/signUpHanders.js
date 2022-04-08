import {
  v4 as uuidv4,
} from 'uuid';
import moment from 'moment';
import {
  getHash,
} from '../authentication/getHash.js';
import {
  getUserId,
  insertUser,
} from '../datastore/userInfo.js';

export function signUpHandler(req, res) {
  // check for already signed in an redirect
  const navData = {
    loggedIn: req.isUserLoggedIn,
  };
  if (req.isUserLoggedIn) {
    navData.userName = req.cookies.userName;
    navData.loggedIn = req.isUserLoggedIn;
    navData.userId = userId;
    res.redirect('/');
  }
  const formData = '';
  res.render('signup', {
    navData,
    failed: false,
    formData,
  });
}

export function signUpPostHandler(req, res) {
  const {
    userName,
    password,
    about,
    realName,
  } = req.body;
  // check for duplicate username, query returns null
  getUserId(userName).then((result) => {
    if (!result) {
      // Hash password for saving
      console.log('password', password);
      const hashedPassword = getHash(password);
      const userId = uuidv4();
      const dateJoined = moment().format('DD-MMM-YYYY');
      const userInfo = {
        userName,
        hashedPassword,
        userId,
        dateJoined,
        about,
        realName,
      };
      // insert into DB returns success true or false
      const userInserted = insertUser(userInfo);
      if (userInserted) {
        console.log('SUCCESSFUL SIGNUP');
        res.redirect('/login');
      } else {
        const failed = 'post';
        // todo: Clarify if it is supposed to be redirect or render
        res.redirect('/signup');
      }
    }
    const navData = {
      loggedIn: false,
    };
    const formData = req.body;
    // userName taken
    const failed = 'username';
    res.render('signup', {
      navData,
      formData,
      failed,
    });
  });
}
