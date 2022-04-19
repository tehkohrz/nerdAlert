import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import {
  getCodeHandler,
  postCodeHandler,
  shareCodeHandler,
  getShareCodeHandler,
  updateCodeHandler,
} from './middleware/routehandlers/codeHandler.js';
import {
  loginHandler,
  logoutHandler,
  loginPostHandler,
} from './middleware/routehandlers/loginHandler.js';
import {
  checkSession,
} from './middleware/authentication/authSession.js';
import {
  mainHandler,
} from './middleware/routehandlers/mainHandler.js';
import {
  signUpHandler,
  signUpPostHandler,
} from './middleware/routehandlers/signUpHanders.js';
import { editProfileHandler, profileHandler } from './middleware/routehandlers/profileHandler.js';
import { getFilesHandler, deleteFileHandler } from './middleware/routehandlers/fileHandler.js';

// Express Declarations
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('plugin'));
app.use(express.static('styles'));
app.use(express.urlencoded({
  extended: false,
}));
app.use(cookieParser());
app.use(methodOverride('_method'));

// MAIN Route to Editor shows editor without login
// Needs to id the session immediately
app.get('/', checkSession, mainHandler);

// Check for login else redirect to login page
app.post('/save', checkSession, postCodeHandler);

// Login route showing login page, login shouldnt show when logged in
app.get('/login', checkSession, loginHandler);
// POST to check login in credentials
app.post('/login', loginPostHandler);
// Logout delete cookies route
app.delete('/logout', logoutHandler);

// Signup route to signup form
// todo: EJS (try to reuse ejs for profile display/edit)
app.get('/signup', checkSession, signUpHandler);
// POST route for posting new sign up details
app.post('/signup', signUpPostHandler);

// User's own
app.get('/profile/:userName', checkSession, profileHandler);

// view another's profile
// todo: not completed
app.get('/profile/:userName/view');

// PUT route for profile edit
app.put('/profile/:userName', checkSession, editProfileHandler);

// GET route for specific file
// todo: add permission authentication
app.get('/code/:id', checkSession, getCodeHandler);

// PUT route to update code file
app.put('/code/:id/update', checkSession, updateCodeHandler);

// Delete the file
app.delete('/code/:id', checkSession, deleteFileHandler);

// Get route to show all your files
app.get('/files/:userName', checkSession, getFilesHandler);

// GET route for shared code
app.get('/share/:shareId/view', checkSession, getShareCodeHandler);

// POST route for codeSharing
app.post('/share/:shareId', checkSession, shareCodeHandler);

app.listen(3004);
