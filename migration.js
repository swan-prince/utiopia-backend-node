const mysql = require('mysql');
const migration = require('mysql-migrations');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({path: './config/config.env'});

/*
INSTRUCTIONS
1. run node migration.js add migration (your migration name) whenever you want to create a new migration
2. run node migration.js up to add all of the migrations to your sql instance once you set your credentials below
3. run node migration.js down to remove all of the migrations from your sql instance
4. run node migration.js refresh to first remove, then add all of the migrations to update your sql instance
5. when you first start migrating, you may have to manually call "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your password';"
   then call "flush privileges;" to connect properly to mysql instances
*/

/* 
I tried using @mysql/xdevapi which supports more secure authentication, but I was not sure how to do migrations
with that module.  Mysql-migrations module needs the mysql module to work properly so I used the mysql module.
I went into the database command line and 
ran "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'my password';'"" to connect.
Then I ran "flush privileges;" to confirm the privileges.
*/

/*
database name
prod - utopia_selling_cart
dev - utopia_tech_db
*/

const conn = mysql.createPool({
  connectionLimit : 10,
  host: 'localhost',
  user: 'root',
  password: 'your password',
  database : 'utopia_tech_db',
  insecureAuth: true
});

migration.init(conn, path.join(__dirname + '/migrations'));