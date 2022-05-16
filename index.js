require("dotenv").config();
const inquirer = require("inquirer");
const db = require("./db");
require("console.table");

// User prompts through CLI
const userOptions = () => {
  console.log("welcome to the employee tracker database");
  return inquirer
  .prompt([
    {
      type: "list",
      name: "options",
      message: "what would you like to do?",
      choices: [
        {
          name: "View all departments",
          value: "displayDepartments",
        },
        { 
          name: "View all roles",
          value: "displayRoles",
        },
        {
          name: "View all employees",
          value: "displayEmployees",
        },
        { 
          name: "Add a department",
          value: "addDepartment",
        },
        {
          name: "Add a role",
          value: "addRole"
        },
        {
          name: "Add an employee",
          value: "addEmployee"
        },
        {
          name: "Update an employee role",
          value: "updateEmployeeRole"
        },
        {
          name: "Exit",
          value: "exit"
        }
      ]
    }
  ])
  .then((res) => {
    let choice = res.options;
    switch (choice) {
      case "displayDepartments":
        displayDepartments();
        break;
      case "displayRoles":
        displayRoles();
        break;
      case "displayEmployees":
        displayEmployees();
        break;
      case "addDepartment":
        addDepartment();
        break;
      case "addRole":
        addRole();
        break;
      case "addEmployee":
        addEmployee();
        break;
      case "updateEmployeeRole":
        updateEmployeeRole();
        break;
      default:
        exit();
    }
  })
}

const displayDepartments = () => {
  // View all departments
  db.displayDepartments()
    .then(([departments]) => {
      console.table(departments);
    })
    .then(() => userOptions());
};

const displayRoles = () => {
  // View all roles
  db.displayRoles()
    .then(([roles]) => {
      console.table(roles);
    })
    .then(() => userOptions());
};

const displayEmployees = () => {
  // View all employees
  db.displayEmployees()
    .then(([employees]) => {
      console.table(employees);
    })
    .then(() => userOptions());
};

const addDepartment = () => {
  // Add a department
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Department name:",
      },
    ])
    .then((department) => {
      db.addDepartment(department)
        .then(() =>
          console.log(`Added ${department.name} to the database successfully`)
        )
        .then(() => userOptions());
    });
};

const addRole = () => {
  // Add employee role
  db.displayDepartments().then(([rows]) => {
    let departments = rows;
    let departmentChoices = departments.map(({ id, department }) => {
      return { value: id, name: department };
    });

    inquirer
      .prompt([
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
          name: "department_id",
          message: "Department:",
          choices: departmentChoices,
        },
      ])
      .then((role) => {
        db.addRole(role)
          .then(() =>
            console.log(`Added ${role.title} to the database successfully`)
          )
          .then(() => userOptions());
      });
  });
};

const addEmployee = () => {
  // Add new employee
  inquirer
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
    .then(res => {
      let first = res.first_name;
      let last = res.last_name;

      db.displayRoles().then(([roles]) => {
        const roleChoices = roles.map(({ id, role }) => ({
          name: role,
          value: id,
        }));
        inquirer
          .prompt({
            type: "list",
            name: "roleId",
            message: "Employee role:",
            choices: roleChoices,
          })
          .then(res => {
            let role = res.roleId;
            db.displayEmployees().then(([rows]) => {
              let employees = rows;
              const managerChoices = employees.map(({ id, employee }) => ({
                  name: employee,
                  value: id,
              }));
              // add 'none' to manager choices
              managerChoices.unshift({ name: "None", value: null });

              inquirer
                .prompt({
                  type: "list",
                  name: "manager",
                  message: "Employee's manager:",
                  choices: managerChoices,
                })
                .then((res) => {
                  let employee = {
                    first_name: first,
                    last_name: last,
                    role_id: role,
                    manager_id: res.manager
                }

                  db.addEmployee(employee)
                    .then(() =>
                      console.log(
                        `Added ${first} ${last} to the database successfully`
                      )
                    )
                    .then(() => userOptions());
                });
            });
          });
      });
    });
};

const updateEmployeeRole = () => {
  // Update employee role
  db.displayEmployees().then(([employees]) => {
    const employeeChoices = employees.map(({ id, employee }) => {
      return { name: employee, value: id };
    });

    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to update?",
          choices: employeeChoices
        },
      ])
      .then(res => {
        let employeeId = res.employee;
        db.displayRoles().then(([roles]) => {
          const roleChoices = roles.map(({ id, role }) => ({
            name: role,
            value: id
          }))

          inquirer
            .prompt([
              {
                type: "list",
                name: "roleId",
                message: "New role:",
                choices: roleChoices,
              },
            ])
            .then(({ roleId }) => {
              db.updateEmployeeRole(employeeId, roleId);
            })
            .then(() => {
              console.log("Employee's role has been updated.");
            })
            .then(() => {
              userOptions();
            });
        });
      });
  });
};

const exit = () => {
  // Exit CLI
  console.log("Exiting application");
  process.exit();
};

userOptions();
