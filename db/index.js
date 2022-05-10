// import connection to database
const connection = require('./connection');

class DB {
  // references the connection 
  constructor(connection) {
    this.connection = connection;
  };

  // find all departments method
  findAllDepartments() {
    return this.connection.promise().query("SELECT department.id, department.name AS department FROM department;");
  };

  // find all roles method
  findAllRoles() {
    return this.connection.promise().query("SELECT role.id, role.title AS job_title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;");
  };

  // find all employees method
  findAllEmployees() {
    return this.connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;");
  };

  // find all managers method
  findAllManagers(employeeId) {
    return this.connection.promise().query("SELECT id, first_name, last_name FROM employee WHERE id != ?", employeeId);
  };

  // add department method
  addDepartment(department) {
    return this.connection.promise().query("INSERT INTO department SET ?", department);
  };

  // delete department method
  deleteDepartment(departmentId) {
    return this.connection.promise().query("DELETE FROM department WHERE id = ?", departmentId);
  };

  // add role method
  addRole(role) {
    return this.connection.promise().query("INSERT INTO role SET ?", role);
  };

  // delete role method
  deleteRole(roleId) {
    return this.connection.promise().query("DELETE FROM role WHERE id = ?", roleId);
  };

  // add employee method
  addEmployee(employee) {
    return this.connection.promise().query("INSERT INTO employee SET ?", employee);
  };

  // delete employee method
  deleteEmployee(employeeId) {
    return this.connection.promise().query("DELETE FROM employee WHERE id = ?", employeeId);
  };

  // update employee role method
  updateEmployeeRole(employeeId, roleId) {
    return this.connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId]);
  };

  // update employee manager method
  updateEmployeeManager(employeeId, managerId) {
    return this.connection.promise().query("UPDATE employee SET manager_id = ? WHERE id = ?", [managerId, employeeId]);
  };
};

module.exports = new DB(connection);
