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
          name: "Remove a department",
          value: "removeDepartment",
        },
        {
          name: "Add a role",
          value: "addRole"
        },
        {
          name: "Remove a role",
          value: "removeRole"
        },
        {
          name: "Add an employee",
          value: "addEmployee"
        },
        { 
          name: "Remove an employee",
          value: "removeEmployee"
        },
        {
          name: "Update an employee role",
          value: "updateEmployeeRole"
        },
        {
          name: "Update an employee's manager",
          value: "updateEmployeeManager"
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
      case "removeDepartment":
        removeDepartment();
        break;
      case "addRole":
        addRole();
        break;
      case "removeRole":
        removeRole();
        break;
      case "addEmployee":
        addEmployee();
        break;
      case "removeEmployee":
        removeEmployee();
        break;
      case "updateEmployeeRole":
        updateEmployeeRole();
        break;
      case "updateEmployeeManager":
        updateEmployeeManager();
        break;
      default:
        exit();
    }
  })
}

const displayDepartments = () => {
  // View all departments
  db.displayDepartments()
    .then(([rows]) => {
      let departments = rows;
      console.log('\n');
      console.table(departments);
    })
    .then(() => userOptions());
};

const displayRoles = () => {
  // View all roles
  db.displayRoles()
    .then(([rows]) => {
      let roles = rows;
      console.log('\n');
      console.table(roles);
    })
    .then(() => userOptions());
};

const displayEmployees = () => {
  // View all employees
  db.displayEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.log('\n');
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
        name: "newDept",
        message: "Department name:",
      },
    ])
    .then(res => {
      let name = res.newDept;
      db.addDepartment(name)
        .then(() =>
          console.log(`Added ${name} to the database successfully`)
        )
        .then(() => userOptions());
    });
};

const removeDepartment = () => {
  // Remove a department
  db.displayDepartments().then(([rows]) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, department }) => ({
      name: department,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentId",
          message: "What department would you like to remove?",
          choices: departmentChoices,
        },
      ])
      .then((res) => db.removeDepartment(res.department))
      .then(() => console.log("The department has been removed."))
      .then(() => userOptions());
  });
};

const addRole = () => {
  // Add employee role
  db.displayDepartments().then(([rows]) => {
    let departments = rows;
    const departmentNames = departments.map(({ id, department }) => ({
      name: department,
      value: id,
    }));

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
          name: "department",
          message: "Department:",
          choices: departmentNames,
        },
      ])
      .then(res => {
        db.addRole(res)
          .then(() =>
            console.log(`Added ${res.title} to the database successfully`)
          )
          .then(() => userOptions());
      });
  });
};

const removeRole = () => {
  // Remove employee role
  db.displayRoles().then(([rows]) => {
    let roles = rows;
    const roleChoices = roles.map(({ id, job_title }) => ({
      name: job_title,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "roleId",
          message: "Which role would you like to remove?",
          choices: roleChoices,
        },
      ])
      .then((res) => db.deleteRole(res.role))
      .then(() => console.log("Removed role from the database successfully"))
      .then(() => userOptions());
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

      db.displayRoles().then(([rows]) => {
        let role = rows;
        const roleChoices = role.map(({ id, job_title }) => ({
          name: job_title,
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
              const managerChoices = employees.map(
                ({ id, first_name }) => ({
                  name: first_name,
                  value: id,
                })
              );
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

const removeEmployee = () => {
  // Remove employee from db
  db.displayEmployees().then(([rows]) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    inquirer
      .prompt({
        type: "list",
        name: "employee",
        message: "Which employee would you like to remove?",
        choice: employeeChoices,
      })
      .then((res) => db.deleteEmployee(res.employee))
      .then(() => console.log("Employee has been removed from database"))
      .then(() => userOptions());
  });
};

const updateEmployeeRole = () => {
  // Update employee role
  db.displayEmployees().then(([rows]) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to update?",
          choices: employeeChoices
        },
      ])
      .then((res) => {
        let employee = res.employee;
        db.displayRoles().then(([rows]) => {
          let roles = rows;
          const roleChoices = roles.map(({ id, job_title }) => ({
            name: job_title,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "roleId",
                message: "New role:",
                choice: roleChoices,
              },
            ])
            .then((res) => db.updateEmployeeRole(employee, res.role))
            .then(() => console.log("Employee's role has been updated."))
            .then(() => userOptions());
        });
      });
  });
};

const updateEmployeeManager = () => {
  // Update employees manager
  db.displayEmployees().then(([rows]) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    inquirer
      .prompt({
        type: "list",
        name: "employeeId",
        message: "Which employee would you like to update?",
        choices: employeeChoices,
      })
      .then((res) => {
        let employee = res.employee;
        db.displayManagers(employee).then(([rows]) => {
          let managers = rows;
          const managerChoices = managers.map(
            ({ id, first_name, last_name }) => ({
              name: `${first_name} ${last_name}`,
              value: id,
            })
          );

          inquirer
            .prompt([
              {
                type: "list",
                name: "managerId",
                message:
                  "Which manager do you want to assign to the selected employee?",
                choices: managerChoices,
              },
            ])
            .then((res) => db.updateEmployeeManager(employee, res.manager))
            .then(() => console.log("Updated employee's manager successfully!"))
            .then(() => userOptions());
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
