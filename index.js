import dotenv from 'dotenv';
import express from 'express';
import pg from 'pg';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';

import { getCode } from './middleware/getCode.js';
// dotenv.config();

// PG Declarations
const {
  Pool,
} = pg;
const pgConnectionConfigs = {
  user: 'tehkohrz',
  host: '127.0.0.1',
  database: 'nerdTest',
  port: 5432, // Postgres server always runs on this port by default
};
const pool = new Pool(pgConnectionConfigs);

// Express Declarations
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('plugin'));
app.use(express.urlencoded({
  extended: false,
}));
app.use(cookieParser());
app.use(methodOverride('_method'));

// MAIN Route to Editor
app.get('/', getCode ,(req, res) => {
  getCode();
  // const sqlQuery = `SELECT * FROM codebin WHERE id = 37`;
  // pool.query(sqlQuery)
  //   .then((result) => {
  //     const data = result.rows[0];
  //     res.render('main', {data});
  //   })
  //   .catch((error) => {
  //     console.log('Error here!',error);
  //   });
});

app.post('/test', (req, res) => {
  const sqlQuery = `INSERT INTO codebin (code) VALUES ('${req.body.codeSaver}') RETURNING *`;
  // // const sqlQuery = `SELECT * FROM codebin`;
  pool.query(sqlQuery)
    .then((result) => {
      console.log(result.rows[0]);
      res.redirect('/');
    })
    .catch((error) => {
      console.log('Error here!',error);
    });
  // pool.query(sqlQuery, (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   console.log('done', result.rows);
  //   res.redirect('/');
  // })
});

app.listen(3004);