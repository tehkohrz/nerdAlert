import dotenv from 'dotenv';
import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import { authLogin } from './middleware/routehandlers/authLogin';
dotenv.config();

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
app.get('/', getCode ,(req, res) => {
  getCode();
});

// Login route showing login page, login shouldnt show when logged in
app.get('/login', (req, res) => {
  res.render ('login', {user:''});
});
// POST to check login in credentials 
app.post('/login', authLogin);
//Logout delete
app.delete('/logout', (req, res) =>{

})

// User profile
app.get('/:userName', XXX)

// 

app.listen(3004);