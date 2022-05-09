// import connection to database
const db = require('./connection');

class DB {
  // db connection reference
  constructor(db) {
    this.db = db;
  };

  // method to display all departments
  displayDepartments() {
    return this.db.promise().query("SELECT department.id, department.name AS department FROM department;");
  };
}