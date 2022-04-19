import { getHash, getSessionHash } from '../authentication/getHash.js';
import { getUserInfo, updateUser } from '../datastore/userInfo.js';

export async function profileHandler(req, res) {
  // If not logged in redirect to login page
  if (!req.isUserLoggedIn) {
    res.redirect('/login');
  }
  if (req.isUserLoggedIn) {
    // Navdata creation for ejs
    const navData = {
      loggedIn: req.isUserLoggedIn,
      userName: req.cookies.userName,
      userId: req.userId,
    };
    // Get userInfo
    const userInfo = await getUserInfo(navData.userName);
    res.render('profile', { navData, userInfo, failed: false });
  }
}

export async function editProfileHandler(req, res) {
  const navData = {
    loggedIn: req.isUserLoggedIn,
    userName: req.cookies.userName,
    userId: req.userId,
  };
  // have to use this id the db entry before the user is changed
  const oldUserName = req.params.userName;
  // May contain a new userName
  const userInfo = { ...req.body };
  // if old and new pasword field has been entered initiate change password
  const dbUserInfo = await getUserInfo(oldUserName);
  userInfo.id = dbUserInfo.id;
  // if user is updated need to update cookies
  if (userInfo.username !== dbUserInfo.username) {
    console.log('User cookies updated');
    res.cookie('userName', userInfo.username);
    res.cookie('sessionHash', getSessionHash(userInfo.username));
  }
  if (userInfo.oldPassword && userInfo.newPassword) {
    // get password in Db
    console.log('user info gotten');
    // Incorrect password given
    if (dbUserInfo.password !== userInfo.oldPassword) {
      userInfo.password = '';
      res.render('profile', { navData, userInfo, failed: 'password' });
    }
    // Correct password
    if (dbUserInfo.password === userInfo.oldPassword) {
      userInfo.hashedPassword = getHash(userInfo.password);
      const updatedUser = updateUser(userInfo);
      console.log('Completed update');
      res.redirect(`/profile/${updateUser.username}`);
    }
  }
  // No new password
  if (userInfo.newPassword === '') {
    userInfo.hashedPassword = dbUserInfo.password;
    const updatedUser = await updateUser(userInfo);
    console.log('No Pw update', updatedUser);
    res.redirect(`/profile/${updatedUser.username}`);
  }
}
