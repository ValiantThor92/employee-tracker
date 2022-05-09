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
  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Department name:",
      },
    ])
    .then((res) => {
      let name = res;
      const sql = `INSERT INTO department (name) VALUES (?)`;
      const params = name.name;
      db.query(sql, params, (err, result) => {
        if (err) throw err;
        console.log(`Added ${name.name} to departments.`);
        userOptions();
      });
    });
};

const removeDepartment = () => { // Remove a department
  db.query(`SELECT * FROM department`, (err, departmentRes) => {
    if (err) throw error;
    const departmentChoices = [];
    departmentRes.forEach(({ id, name }) => {
      departmentChoices.push({
        name: name,
        value: id,
      });
    });
    inquirer
      .prompt({
        type: "list",
        name: "departmentId",
        message: "What department would you like to remove?",
        choices: departmentChoices,
      })
      .then((res) => {
        departmentId = res.departmentId;
        db.query(
          `DELETE FROM department WHERE id = ?`,
          departmentId,
          (err, res) => {
            if (err) throw err;
            console.log("The department has been removed.");
            userOptions();
          }
        );
      });
  });
};

const addRole = () => { // Add employee role
  const departments = [];
  db.query(`SELECT department.id, department.name, FROM department;`,
  (err, res) => {
    if (err) throw err;
    res.forEach((department) => {
      let departmentChoice = {
        name: department.name,
        value: department.id,
      };
      departments.push(departmentChoice);
    });
    let addRolePrompt = [
      {
        type: "input",
        name: "title",
        message: "Role title:",
      },
      {
        type: "input",
        name: "salary",
        message: "salary:",
      },
      {
        type: "list",
        name: "department",
        message: "Department:",
        choices: departments,
      },
    ];
    inquirer.prompt(addRolePrompt).then((response) => {
      const sql = `INSERT INTO ROLE (title, salary, department_id) VALUES (?)`;
      db.query(
        sql,
        [[response.title, response.salary, response.department]],
        (err, res) => {
          if (err) throw err;
          console.log(`Added ${response.title} to roles.`);
          userOptions();
        }
      );
    });
  });
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