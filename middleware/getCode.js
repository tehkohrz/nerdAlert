import pg from "pg";



export function getCode (req, res, next) {
const sqlQuery = `SELECT * FROM codebin WHERE id = 37`;
  pool.query(sqlQuery)
    .then((result) => {
      const data = result.rows[0];
      res.render('main', {data});
      next();
    })
    .catch((error) => {
      console.log('Error here!',error);
    });
  }