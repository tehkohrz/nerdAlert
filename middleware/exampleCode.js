import { header } from 'express/lib/request';
import res from 'express/lib/response';
import pool from './datastore/initPG.js';

export function getCode(req, res, next) {
  const sqlQuery = 'SELECT * FROM codebin WHERE id = 37';
  pool.query(sqlQuery)
    .then((result) => {
      const data = result.rows[0];
      res.render('main', { data });
      next();
    })
    .catch((error) => {
      console.log('Error here!', error);
    });
}
// 1. Route
// 2. express route handler

// 3. SQL query (dataStore) sorted by domains/table (user or code)
async function getCodeById() {
  const sqlQuery = 'SELECT * FROM codebin WHERE id = 37';
  try {
    const result = await pool.query(sqlQuery);
    return here;
  } catch (error) {

  }
}

// .then((result) => {
//   const data = result.rows[0];
//   res.render('main', {data});
//   next();
// })};

// // Questions
// When the form submission fails render or redirect is used?
// Upon failed post the url changes to keep the http request as post?
// how to redirect and also send some data so that the req can work with?
// wrapping of CSS how to section out the elements?
// how to use ejs to change attributes?

// ESLINT issues
