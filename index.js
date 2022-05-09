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
    console.table(res);
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
  db.query(`SELECT * FROM role`, (err, roleRes) => {
    if (err) throw err;
    const roleChoices = [];
    roleRes.forEach(({ id, title }) => {
      roleChoices.push({
        name: title,
        value: id,
      });
    });
    inquirer
      .prompt({
        type: "list",
        name: "roleId",
        message: "Which role would you like to remove?",
        choices: roleChoices,
      })
      .then((res) => {
        roleId = res.roleId;
        db.query(`DELETE FROM role WHERE id = ?`, roleId, (err, res) => {
          if (err) throw err;
          console.log("The role has been removed.");
          userOptions();
        });
      });
  });
};

const addEmployee = () => { // Add new employee
  return inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Employee first name:",
      },
      {
        type: "input",
        name: "last_name",
        message: "Employee last name:",
      },
    ])
    .then((res) => {
      let firstName = res.first_name;
      let lastName = res.last_name;
      db.query(`SELECT * FROM role`, (err, roleRes) => {
        if (err) throw err;
        const roleChoices = [];
        roleRes.forEach(({ id, title }) => {
          roleChoices.push({
            name: title,
            value: id,
          });
        });
        inquirer
          .prompt({
            type: "list",
            name: "roleId",
            message: "Employee role:",
            choices: roleChoices,
          })
          .then((res) => {
            roleId = res.roleId;
            db.query(`SELECT * FROM employee`, (err, employeeRes) => {
              if (err) throw err;
              const managerChoices = [
                {
                  name: "None",
                  value: null,
                },
              ];
              employeeRes.forEach(({ id, first_name, last_name }) => {
                managerChoices.push({
                  name: first_name + " " + last_name,
                  value: id,
                });
              });
              inquirer
                .prompt({
                  type: "list",
                  name: "managerId",
                  message: "Employee's manager:",
                  choices: managerChoices,
                })
                .then((res) => {
                  const sql = `INSERT INTO EMPLOYEES (first_name, last_name, role_id, manager_id) VALUES (?)`;
                  db.query(
                    sql,
                    [[fistname, lastname, roleId, res.managerId]],
                    (err, res) => {
                      if (err) throw err;
                      console.log(`Added ${firstName} ${lastName} as an employee.`);
                      userOptions();
                    }
                  );
                });
            });
          });
      });
    });
};

const removeEmployee = () => { // Remove employee from db
  db.query(`SELECT * FROM employee`, (err, employeeRes) => {
    if (err) throw err;
    const employeeChoices = [];
    employeeRes.forEach(({ id, first_name, last_name }) => {
      employeeChoices.push({
        name: first_name + " " + last_name,
        value: id,
      });
    });

    inquirer
      .prompt({
        type: "list",
        name: "employeeId",
        message: "Which employee would you like to remove?",
        choice: employeeChoices,
      })
      .then((res) => {
        employeeId = res.employeeId;
        db.query(
          `DELETE FROM employee WHERE id = ?`,
          employeeId,
          (err, res) => {
            if (err) throw err;
            console.log("Employee has been removed.");
            userOptions();
          }
        );
      });
  });
};

const updateEmployeeRole = () => { // Update employee role
  db.query(`SELECT * FROM employee;`, (err, employeeRes) => {
    if (err) throw err;
    const employeeChoices = [];
    employeeRes.forEach(({ id, first_name, last_name })=> {
      employeeChoices.push({
        name: first_name + " " + last_name,
        value: id,
      });
    });
    inquirer
      .prompt({
        type: "list",
        name: "employeeId",
        message: "Which employee would you like to update?",
        choices: employeeChoices,
      })
      .then((res) => {
        employeeId = res.employeeId;
        db.query(`SELECT * FROM role`, (err, roleRes) => {
          if (err) throw err;
          const roleChoices = [];
          roleRes.forEach(({ id, title }) => {
            roleChoices.push({
              name: title,
              value: id,
            });
          });
          inquirer
            .prompt({
              type: "list",
              name: "roleId",
              message: "New role:",
              choice: roleChoices,
            })
            .then((res) => {
              roleId = res.roleId;
              db.query(`UPDATE employee SET role_id = ? where id = ?`,
                [roleId, employeeId],
                (err, res) => {
                  if (err) throw err;
                  console.log("Employee's role has been updated.");
                  userOptions();
                }
              );
            });
        });
      });
  });
};

const updateEmployeeManager = () => { // Update employees manager
  db.query(`SELECT * FROM employee;`, (err, employeeRes) => {
    if (err) throw err;
    const employeeChoices = [];
    employeeRes.forEach(({ id, first_name, last_name}) => {
      employeeChoices.push({
        name: first_name + " " + last_name,
        value: id,
      });
    });
    inquirer
      .prompt({
        type: "list",
        name: "employeeId",
        message: "Which employee would you like to update?",
        choices: employeeChoices,
      })
      .then((res) => {
        employeeId = res.employeeId;
        db.query(`SELECT id, first_name, last_name FROM employee WHERE id != ?`,
        employeeId,
        (err, managersRes) => {
          if (err) throw err;
          const managerChoices = [];
          managersRes.forEach(({ id, first_name, last_name }) => {
            managerChoices.push({
              name: first_name + " " + last_name,
              value: id,
            });
          });
          inquirer
            .prompt({
              type: "list",
              name: "employeeId",
              message: "Which employee would you like to update",
              choices: employeeChoices,
            })
            .then((res) => {
              employeeId = res.employeeId;
              db.query(`SELECT id, first_name, last_name FROM employee WHERE id != ?`,
              employeeId,
              (err, managersRes) => {
                if (err) throw err;
                const managerChoices = [];
                managersRes.forEach(({ id, first_name, last_name}) => {
                  managerChoices.push({
                    name: first_name + " " + last_name,
                    value: id,
                  });
                });
                inquirer
                  .prompt({
                    type: "list",
                    name: "managerId",
                    message: "New manager:",
                    choices: managerChoices,
                  })
                  .then((res) => {
                    managerId = res.managerId;
                    db.query(`UPDATE employee SET manager_id = ? WHERE id = ?`,
                      [managerId, employeeId],
                      (err, res) => {
                        if (err) throw err;
                        console.log("Employee's manager has been updated.");
                        userOptions();
                      }
                    );
                  });
              }
              );
            });
        }
        );
      });
  });
};

const exit = () => { // Exit CLI
  console.log("Exiting application");
  process.exit();
};