import {
  v4 as uuidv4,
} from 'uuid';
import {
  getUserIdGroups,
} from '../datastore/userInfo.js';
import {
  getUserIdFiles,
} from '../datastore/fileInfo.js';

// eslint-disable-next-line import/prefer-default-export
export async function mainHandler(req, res) {
  // Generates session Id so that code can be identified
  const codeSessionId = uuidv4();
  console.log('Reset sessionId');
  res.cookie('codeSessionId', codeSessionId);
  // Create navData object for navBar use
  const navData = {
    loggedIn: req.isUserLoggedIn,
  };
  const sideBarData = {};
  const editorData = {};
  editorData.codeData = '';
  editorData.permissions = [];
  // Check for req.login to render profile specific page
  if (req.isUserLoggedIn) {
    // Get userId for links and other queries
    const {
      userId,
    } = req;
    // Update navData
    navData.userName = req.cookies.userName;
    navData.loggedIn = req.isUserLoggedIn;
    navData.userId = userId;

    // todo: fix side bar issues after fixing file structure
    // todo: promise for all queries
    // Retrieve user's files for Side Bar
    sideBarData.ownFiles = await getUserIdFiles(userId);
    // Array of Groups User is in
    const groups = await getUserIdGroups(userId);
    const sharedFiles = {};
    const permissionArray = [];
    permissionArray.push({
      display: 'Me',
      value: userId,
    });
    if (groups) {
      const groupArray = [];
      if (!groups.length) {
        groupArray.push(groups);
        permissionArray.push({
          display: groups.name,
          value: groups.id,
        });
      } else {
        groupArray = [...groups];
      }
      // Retrieve files owned by the group
      await groupArray.foreach((group) => {
        // todo: check for return of promise then end with promise.all outside of loop
        const groupFiles = getUserIdFiles(group.id);
        sharedFiles[group.name] = groupFiles;
        permissionArray.push({
          display: group.name,
          value: group.id,
        });
      });
    }
    sideBarData.sharedFiles = sharedFiles;
    editorData.permissions = permissionArray;
  }
  res.render('main', {
    navData,
    sideBarData,
    editorData,
  });
}
