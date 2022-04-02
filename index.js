import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import { postCode } from './middleware/routehandlers/postCode.js';
import { checkPassword } from './middleware/routehandlers/authLogin.js';

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
app.get('/', (req, res) => {
  res.render('main', {codeData:null});
});

// Check for login else redirect to login page
app.post('/save', postCode);

// Login route showing login page, login shouldnt show when logged in
app.get('/login', (req, res) => {
  res.render ('login', {user:''});
});
// POST to check login in credentials 
app.post('/login', checkPassword);
//Logout delete
app.delete('/logout', (req, res) =>{

})

// User profile
app.get('/:userName')

// 

app.listen(3004);