const mysql = require("mysql2"); // import all necessary dependencies

const connection = mysql.createConnection({ // connect to database
    host: "localhost",
    // your mysql username
    user: process.env.DB_USER,
    // your mysql password
    password: process.env.DB_PW,
    database: process.env.DB_NAME
  },
  console.log("Connected to the employee tracker database.")
);

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
