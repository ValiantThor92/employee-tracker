require("dotenv").config();
const inquirer = require('inquirer');
const db = require("./db/connection.js");
require('console.table');

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
    .then(res => {
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
  db.displayDepartments()
  .then(([rows]) => {
    let departments = rows;
    console.table(departments);
  })
  .then(() => userOptions());
};

const viewRoles = () => { // View all roles
  db.findAllRoles()
    .then(([rows]) => {
      let roles = rows
      console.table(roles);
    })
    .then(() => userOptions());
};

const viewEmployees = () => { // View all employees
  db.findAllEmployees()
  .then(([rows]) => {
    let employees = rows;
    console.table(employees);
  })
  .then(() => userOptions());
};

const addDepartment = () => { // Add a department
  inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Department name:",
    },
  ])
  .then(res => {
    let name = res;
    db.addDepartment(name)
      .then(() => console.log(`Added ${name.name} to the database successfully`))
      .then(() => userOptions());
  });
};

const removeDepartment = () => { // Remove a department
  db.displayDepartments()
  .then(([rows]) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, department }) => ({
      name: department,
      value: id
    }));
    
    inquirer.prompt([
      {
        type: "list",
        name: "departmentId",
        message: "What department would you like to remove?",
        choices: departmentChoices
      }
    ])
    .then(res => db.deleteDepartment(res.department))
    .then(() => console.log("The department has been removed."))
    .then(() => userOptions()); 
  });
};

const addRole = () => { // Add employee role
  db.displayDepartments()
    .then(([rows]) => {
      let departments = rows;
      const departmentNames = departments.map(({ id, department }) => ({
        name: department,
        value: id
    }));

    inquirer.prompt([
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
        choices: departmentNames
      },
    ])
    .then(role => {
      db.addRole(role)
      .then(() => console.log(`Added ${role.title} to the database successfully`))
      .then(() => userOptions());
    });
  });
};

const removeRole = () => { // Remove employee role
  db.findAllRoles()
  .then(([rows]) => {
    let roles = rows;
    const roleChoices = roles.map(({ id, job_title }) => ({
        name: job_title,
        value: id
    }));

    inquirer.prompt([
      {
        type: "list",
        name: "roleId",
        message: "Which role would you like to remove?",
        choices: roleChoices,
      }
    ])
    .then(res => db.deleteRole(res.role))
    .then(() => console.log('Removed role from the database successfully'))
    .then(() => userOptions());
  });  
};

const addEmployee = () => { // Add new employee
  inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "Employee first name:",
    },
    {
      type: "input",
      name: "last_name",
      message: "Employee last name:",
    }
  ])
  .then((res) => {
    let firstName = res.first_name;
    let lastName = res.last_name;

    db.findAllRoles()
    .then(([rows]) => {
      let roles = rows;
      const roleChoices = roles.map(({ id, job_title }) => ({
        name: job_title,
        value: id,
      }));

      inquirer.prompt({
          type: "list",
          name: "roleId",
          message: "Employee role:",
          choices: roleChoices
      })
      .then(res => {
      let role = res.role;
      db.findAllEmployees()
        .then(([rows]) => {
          let employees = rows;
          const managerChoices = employees.map(({ id, first_name, last_name }) => ({
              name: `${first_name} ${last_name}`,
              value: id
          }));
            // add 'none' to manager choices
            managerNames.unshift({ name: 'None', value: null });

            inquirer.prompt({
              type: "list",
              name: "managerId",
              message: "Employee's manager:",
              choices: managerChoices,
            })
            .then(res => {
              let employee = {
                manager_id: res.manager,
                role_id: role,
                first_name: firstName,
                last_name: lastName
              }

              db.addEmployee(employee)
              .then(() => console.log(`Added ${firstName} ${lastName} to the database successfully`))
              .then(() => userOptions());
            });
        });
      });
    });
  });
};

const removeEmployee = () => { // Remove employee from db
  db.findAllEmployees()
    .then(([rows]) => {
    let employees= rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
  }));

      inquirer.prompt({
        type: "list",
        name: "employeeId",
        message: "Which employee would you like to remove?",
        choice: employeeChoices,
      })
      .then(res => db.deleteEmployee(res.employee))
      .then(() => console.log('Employee has been removed from database'))
      .then(() => userOptions());
  });
};

const updateEmployeeRole = () => { // Update employee role
  db.findAllEmployees()
  .then(([rows]) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));

    inquirer.prompt([
      {
      type: "list",
      name: "employeeId",
      message: "Which employee would you like to update?",
      choices: employeeChoices,
      }
    ])
    .then(res => {
      let employee = res.employee;
      db.findAllRoles()
      .then(([rows]) => {
        let roles = rows;
        const roleChoices = roles.map(({ id, job_title }) => ({
          name: job_title,
          value: id
        }));

        inquirer.prompt([
          {
            type: "list",
            name: "roleId",
            message: "New role:",
            choice: roleChoices
          }
        ])
        .then(res => db.updateEmployeeRole(employee, res.role))
        .then(() => console.log("Employee's role has been updated."))
        .then(() => userOptions());
      });
    });
  });
};

const updateEmployeeManager = () => { // Update employees manager
  db.findAllEmployees()
  .then(([rows]) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name}) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));
    inquirer.prompt({
      type: "list",
      name: "employeeId",
      message: "Which employee would you like to update?",
      choices: employeeChoices,
    })
    .then((res) => {
      let employee = res.employee;
      db.findAllManagers(employee)
      .then(([rows]) => {
        let managers = rows;
        const managerChoices = managers.map(({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id
        }));
      
        inquirer.prompt([
          {
            type: "list",
            name: "managerId",
            message: "Which manager do you want to assign to the selected employee?",
            choices: managerChoices
          }
        ])
        .then(res => db.updateEmployeeManager(employee, res.manager))
        .then(() => console.log("Updated employee's manager successfully!"))
        .then(() => userOptions());
      });
    });
  });
};

const exit = () => { // Exit CLI
  console.log("Exiting application");
  process.exit();
};