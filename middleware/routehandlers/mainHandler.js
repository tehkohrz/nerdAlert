import {
  v4 as uuidv4
} from 'uuid';
import {
  getUserIdGroups,
  getUserId
} from '../datastore/userInfo';
import {
  getUserIdFiles
} from '../datastore/fileInfo';

export function mainHandler(req, res) {
  // Generates session Id so that code can be identified
  const codeSessionId = uuidv4();
  res.cookie('codeSessionId', codeSessionId);
  // Create navData object for navBar use
  const navData = {
    loggedIn: req.isLoggedIn
  };
  const sideBarData = {};
  // Check for req.login to render profile specific page
  if (req.isLoggedIn) {
    // Get userId for links and other queries
    const userId = getUserId(req.cookies.userName);
    // Update navData
    navData.userName = req.cookies.userName;
    navData.loggedIn = req.isLoggedIn;
    navData.userId = userId;

    // Retrieve user's files for Side Bar
    sideBarData.ownFiles = getUserIdFiles(userId);
    // Array of Groups User is in
    const groups = getUserIdGroups(userId)
    const sharedFiles = {};
    // Retrieve files owned by the group
    groups.foreach((group) => {
      const groupFiles = getUserIdFiles(group.id);
      sharedFiles[group.name] = groupFiles;
    });
    sideBarData.sharedFiles = sharedFiles;
  }
  res.render('main', {navData, sideBarData})
}