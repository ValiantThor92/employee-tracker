const inquirer = require("inquirer");
const db = require("./db/connection.js");
const console = require("console.table");

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  userOptions();
});

// User prompts through CLI
const userOptions = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "what would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Remove a department",
          "Add a role",
          "Remove a role",
          "Add an employee",
          "Remove an employee",
          "Update an employee role",
          "Update an employee's manager",
          "Exit",
        ],
      },
    ])
    .then((res) => {
      let choice = res.options;
      switch (choice) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Remove a department":
          removeDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Remove a role":
          removeRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Remove an employee":
          removeEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Update an employee's manager":
          updateEmployeeManager();
          break;
        default:
          exit();
      }
    });
};

const viewDepartments = () => { // View all departments
  db.query(`SELECT department.id, department.name AS department FROM department;`,
  (err, res) => {
    if (err) throw err;
    console.tabe(res);
    userOptions();
  });
};

const viewRoles = () => { // View all roles
  db.query(`SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;`,
  (err, res) => {
    if (err) throw err;
    console.table(res);
    userOptions();
  });
};

const viewEmployees = () => { // View all employees
  db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`,
  (err, res) => {
    if (err) throw err;
    console.table(res);
    userOptions();
  });
};

const addDepartment = () => { // Add a department

};

const removeDepartment = () => { // Remove a department

};

const addRole = () => { // Add employee role

};

const removeRole = () => { // Remove employee role

};

const addEmployee = () => { // Add new employee

};

const removeEmployee = () => { // Remove employee

};

const updateEmployeeRole = () => { // Update employee role

};

const updateEmployeeManager = () => { // Update employees manager

};

const exit = () => { // Exit CLI

};