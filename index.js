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
    .prompt({
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
    })
}