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

const viewDepartments = () => {
  db.query(`SELECT department.id, department.name AS department FROM department;`,
  (err, res) => {
    if (err) throw err;
    console.tabe(res);

    userOptions();
  });
};

const viewRoles = () => {

};

const viewEmployees = () => {

};

const addDepartment = () => {

};

const removeDepartment = () => {

};

const addRole = () => {

};

const removeRole = () => {

};

const addEmployee = () => {

};

const removeEmployee = () => {

};

const updateEmployeeRole = () => {

};

const updateEmployeeManager = () => {

};

const exit = () => {

};