import {
  v4 as uuidv4,
} from 'uuid';
import {
  escapeSpecials,
  returnSpecials,
} from '../../scripts/escapeSpecials.js';
import {
  getCodeFile,
  insertPermission,
  saveCode,
} from '../datastore/fileInfo.js';
import { getUserIdGroups } from '../datastore/userInfo.js';

// POST Handler for posting code into the DB

export async function postCodeHandler(req, res) {
  const codeData = {};
  codeData.id = req.cookies.codeSessionId;
  const rawData = req.body.codeSaver;
  console.log('rawData', req.body);
  codeData.data = escapeSpecials(rawData);
  codeData.userId = req.userId;
  codeData.fileName = req.body.fileName;
  codeData.permissionId = uuidv4();
  console.log('fileId', codeData.id);
  // Insert into DB
  const result = await saveCode(codeData);
  // Insert persmission into DB
  const permInsert = await insertPermission(codeData);
  // Redirect to specific page for code
  res.redirect(`/code/${codeData.id}`);
}

export async function getCodeHandler(req, res) {
  const navData = {
    loggedIn: req.isUserLoggedIn,
  };
  const {
    id,
  } = req.params;
  if (!req.isUserLoggedIn) {
    res.redirect('/login');
  }
  if (req.isUserLoggedIn) {
    // Get userId for links and other queries
    const { userId } = req;
    // Update navData
    navData.userName = req.cookies.userName;
    navData.loggedIn = req.isUserLoggedIn;
    navData.userId = userId;
    // editorData for EJS
    const editorData = {};
    // Query for codedata into editor data
    editorData.codeData = await getCodeFile(id);
    // Return specials into the code
    editorData.codeData.codedata = returnSpecials(editorData.codeData.codedata);
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
    editorData.permissions = permissionArray;
    editorData.codeView = true;
    res.render('codeView', {
      navData,
      editorData,
    });
  }
}
