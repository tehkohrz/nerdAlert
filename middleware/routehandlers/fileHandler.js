import {
  getUserIdFiles, deleteCode, deletePermissions,
} from '../datastore/fileInfo.js';

// show all the file the user owns
// eslint-disable-next-line import/prefer-default-export
export async function getFilesHandler(req, res) {
  const { userName } = req.params;
  const {
    userId,
    isUserLoggedIn,
  } = req;
  const navData = {
    loggedIn: req.isUserLoggedIn,
  };
  // Check for login
  if (isUserLoggedIn && userName === req.cookies.userName) {
    navData.userName = userName;
    navData.userId = userId;
    // Retrieve all the files using id
    const listOfFiles = await getUserIdFiles(userId);
    // sort files in alphabetical order
    if (listOfFiles) {
      listOfFiles.sort((a, b) => a.filename - b.filename);
    }
    res.render('fileView', {
      navData,
      listOfFiles,
      errMsg: '',
    });
  } else {
    res.redirect('/login');
  }
}

// Delete Code handler
export async function deleteFileHandler(req, res) {
  const {
    userName,
  } = req.cookies;
  const {
    userId,
    isUserLoggedIn,
  } = req;
  const navData = {
    loggedIn: req.isUserLoggedIn,
  };
  if (isUserLoggedIn) {
    navData.userName = req.cookies.userName;
    navData.userId = userId;
    const codeId = req.params.id;
    const codeDeleted = await deleteCode(codeId, userId);
    const permsDeleted = await deletePermissions(codeId);
    console.log({ codeDeleted });
    if (codeDeleted) {
      res.redirect(`/files/${userName}`);
    } else {
      // todo: find a way to pass the error msg to a redirect
      const errMsg = 'There is an error, please logout and login again.';
      res.redirect(`/files/${userName}`);
    }
  } else {
    res.redirect('/login');
  }
}
