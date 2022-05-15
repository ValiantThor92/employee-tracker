// import connection to database
const connection = require("./connection");

class DB {
  // references the connection
  constructor(connection) {
    this.connection = connection
  }
  // find all departments method
  displayDepartments() {
    return this.connection
    .promise()
    .query(
      "SELECT department.id, department.name FROM department;"
    );
  }
  // find all roles method
  displayRoles() {
    return this.connection
    .promise()
    .query(
      "SELECT role.id, role.title AS role, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;"
    );
  }
  // find all employees method
  displayEmployees() {
    return this.connection
    .promise()
    .query(
      "SELECT employee.id, CONCAT(employee.first_name,' ', employee.last_name) AS employee, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;"
    );
  }
  // add department method
  addDepartment(name) {
    return this.connection
    .promise()
    .query(`INSERT INTO department (name) VALUES ('${name}');`)
  }
  // add employee method
  addEmployee(employee) {
    return this.connection
    .promise()
    .query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${employee.first_name}', '${employee.last_name}', ${employee.role_id}, ${employee.manager_id});`)
  }
  // update employee role method
  updateEmployeeRole(employeeId, roleId) {
    return this.connection
    .promise()
    .query("UPDATE employee SET role_id = ? WHERE id = ?", [
      roleId,
      employeeId,
    ]);
  }
}

module.exports = new DB(connection);
