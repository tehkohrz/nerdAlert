import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import {
  getCodeHandler,
  postCodeHandler,
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
import { profileHandler } from './middleware/routehandlers/profileHandler.js';

// Express Declarations
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('plugin'));
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

// User profile
app.get('/profile/:userName', checkSession, profileHandler);

// Edit User profile form
app.get('/profile/:userName/edit');

// PUT route for profile edit

// GET route for specific file
// todo: add permission authentication
app.get('/code/:id', checkSession, getCodeHandler);

// Group Creation

app.listen(3004);
