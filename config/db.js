const mysql = require('mysql');

const conn = mysql.createConnection({
    host: process.env.NODE_ENV === 'development' ? process.env.DB_HOST_DEV : process.env.DB_HOST_PROD,
    user: process.env.NODE_ENV === 'development' ? process.env.DB_USER_DEV : process.env.DB_USER_PROD,
    password: process.env.NODE_ENV === 'development' ? process.env.DB_PASSWORD_DEV : process.env.DB_PASSWORD_PROD,
    database: process.env.NODE_ENV === 'development' ? process.env.DB_NAME_DEV : process.env.DB_NAME_PROD
  });

module.exports = conn;