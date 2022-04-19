import {
  v4 as uuidv4,
}
  from 'uuid';
import moment from 'moment';
import {
  escapeSpecials,
  returnSpecials,
} from '../../scripts/escapeSpecials.js';
import {
  getCodeFile,
  insertPermission,
  saveCode,
  updateCode,
  getTempFile,
  updateIntoTemp,
  checkTempFile,
} from '../datastore/fileInfo.js';

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
  console.log('fileId saved', codeData.id);
  // Insert into DB
  const result = await saveCode(codeData);
  // Insert persmission into DB
  const permInsert = await insertPermission(codeData);
  // Redirect to specific page for code
  res.redirect(`/code/${codeData.id}`);
}

// GET Handler to show saved code for editing
export async function getCodeHandler(req, res) {
  // Set shareId into cookies
  const shareId = uuidv4();
  res.cookie('shareId', shareId);
  console.log('Getting code');
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
    const {
      userId,
    } = req;
    // Set Session id to be the correct file
    // Update navData
    navData.userName = req.cookies.userName;
    navData.loggedIn = req.isUserLoggedIn;
    navData.userId = userId;
    // editorData for EJS
    const editorData = {};
    // Query for codedata into editor data
    const [savedCode] = await getCodeFile(id);
    // if the viewer is the owner of the file then show
    if (savedCode.user_id === navData.userId) {
      console.log('Authorised access');
      editorData.codeData = savedCode;
      // Return specials into the code
      res.cookie('codeSessionId', editorData.codeData.id);
      editorData.codeData.codedata = returnSpecials(editorData.codeData.codedata);
      editorData.codeView = true;
      editorData.shareId = shareId;
      editorData.shareUrl = `localhost:3004/share/${shareId}`;
      res.render('codeView', {
        navData,
        editorData,
      });
    } else {
      // For unauthorised access
      console.log('Unauthorised access');
      editorData.codeView = false;
      editorData.unAuthorised = true;
      res.render('main', {
        navData,
        editorData,
      });
    }
  }
}

// PUT Handler to update the code already saved into the db
export async function updateCodeHandler(req, res) {
  const codeData = {};
  codeData.id = req.params.id;
  codeData.codeData = req.body.codeSaver;
  codeData.fileName = req.body.fileName;
  codeData.userId = req.userId;
  // remove special characters
  codeData.codeData = escapeSpecials(codeData.codeData);
  // Check for authorised access
  const [savedCode] = await getCodeFile(codeData.id);
  if (savedCode.user_id === codeData.userId) {
    // update into DB
    const codeUpdate = await updateCode(codeData);
    if (codeUpdate) {
      console.log('Code Updated');
      // res.redirect(`/code/${codeData.id}`);
    } else {
      res.send('Update failed');
    }
  } else {
    // not the right user to edit and save
    res.redirect(`/code/${codeData.id}`);
  }
}

export async function shareCodeHandler(req, res) {
  console.log('into shared handler');
  const {
    shareId,
  } = req.cookies;
  const codeData = {
    ...req.body,
  };
  codeData.shareId = shareId;
  codeData.codeSaver = escapeSpecials(codeData.codeSaver);
  codeData.date = moment().format('DD-MMM-YYYY');
  // SQL handler for tempDB
  const newFile = await checkTempFile(shareId);
  console.log('updating into db', { newFile });
  // todo: error handling if code was not updated into Db
  const updatedIntoSharedCode = await updateIntoTemp(codeData, newFile);
  // redirect to shared code url
  res.redirect(`/share/${shareId}/view`);
}

// GET Share code handler

export async function getShareCodeHandler(req, res) {
  const {
    shareId,
  } = req.params;
  const navData = {
    loggedIn: req.isUserLoggedIn,
  };
  console.log(navData);
  // log user data if they are logged in
  if (req.isUserLoggedIn) {
    // Get userId for links and other queries
    const {
      userId,
    } = req;
    // Set Session id to be the correct file

    // Update navData
    navData.userName = req.cookies.userName;
    navData.loggedIn = req.isUserLoggedIn;
    navData.userId = userId;
  }
  // search in share db else go main
  const editorData = {};
  // set codeview to true
  editorData.codeView = true;
  const savedCode = await getTempFile(shareId);
  [editorData.codeData] = savedCode;
  editorData.codeData.codedata = returnSpecials(editorData.codeData.codedata);
  res.render('codeView', {
    navData,
    editorData,
  });
}
