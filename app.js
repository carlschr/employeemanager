const sql = require('mysql');
const inquirer = require('inquirer');
const view = require('./routes/view');
const add = require('./routes/add');
const update = require('./routes/update');

const connection = sql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: process.env.PORT || 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "company_DB"
});

connection.connect(err => {
    if (err) {
        console.log(`Something went wrong: ${err.message}`);
        return;
    };
    console.log('------------------------------------------\nWelcome to the Employee Management System!\n------------------------------------------');
    runApp();
});

const runApp = () => {
    inquirer.prompt({
        type: 'list',
        name: 'actions',
        message: 'What action would you like to perform?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'View Managers', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Update Employee Manager', 'Quit'],
        loop: false
    }).then(answer => {
        //Decides which function to run based on input
        switch (answer.actions) {
            case 'View All Departments':
                view.allDepts(connection, runApp);
                break;
            case 'View All Roles':
                view.allRoles(connection, runApp);
                break;
            case 'View All Employees':
                view.allEmployees(connection, runApp);
                break;
            case 'View Managers':
                view.allManagers(connection, runApp);
                break;
            case 'Add Department':
                departmentInq();
                break;
            case 'Add Role':
                roleInq();
                break;
            case 'Add Employee':
                employeeInq();
                break;
            case 'Update Employee Role':
                updateRoleInq();
                break;
            case 'Update Employee Manager':
                updateManagerInq();
                break;
            case 'Quit':
                console.log('Goodbye.')
                connection.end();
                break;
            //If something goes wrong, it reruns the app
            default:
                break;
        };
    });
};

//Function to acquire the necessary data to create a department
const departmentInq = () => {
    inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'What is the name of the new department?'
    }).then(answer => {
        add.department(connection, runApp, {name: answer.name});
    });
};

//Function to acquire the necessary data to create a role
const roleInq = () => {
    let depts = [];
    connection.query('SELECT department_name, id FROM department', (err, res) => {
        if (err) {
            console.log(`Something went wrong: ${err.message}`);
            runApp();
        };

        res.forEach(dept => {
            depts.push(dept.department_name);
        });

        inquirer.prompt([{
            type: 'input',
            name: 'title',
            message: 'What is the title of this new role?'
        }, {
            type: 'number',
            name: 'salary',
            message: 'What is the salary for this position?'
        }, {
            type: 'list',
            name: 'dept',
            message: 'To which department does this role belong?',
            choices: depts,
            loop: false
        }]).then(answers => {
            let deptID = 0;
            res.forEach(dept => {
                if (dept.department_name === answers.dept) deptID = dept.id;
            });
            add.role(connection, runApp, {title: answers.title, salary: answers.salary, deptID: deptID});
        });
    });
};

//Function to acquire the necessary data to create a role
const employeeInq = () => {
    let roles = [];
    let managers = [];
    connection.query('SELECT role.id AS role_id, employee.id AS employee_id, title, first_name, last_name FROM role LEFT JOIN employee ON manager_id = 0 AND role.id = role_id', (err, res) => {
        if (err) {
            console.log(`Something went wrong: ${err.message}`);
            runApp();
            return;
        };

        res.forEach(roleAndManager => {
            roles.push(roleAndManager.title);
            if (roleAndManager.first_name !== null) {
                managers.push(`${roleAndManager.first_name} ${roleAndManager.last_name}`);
            };
        });

        managers.push('They are a manager');

        inquirer.prompt([{
            type: 'input',
            name: 'first',
            message: 'What is the employee\'s first name?',
        }, {
            type: 'input',
            name: 'last',
            message: 'What is the employee\'s last name?',
        }, {
            type: 'list',
            name: 'role',
            message: 'What is the employee\'s role?',
            choices: roles,
            loop: false
        }, {
            type: 'list',
            name: 'manager',
            message: 'Who will manage this employee?',
            choices: managers,
            loop: false
        }]).then(answers => {
            let roleID = 0;
            let managerID = 0;
            res.forEach(roleAndManager => {
                if (roleAndManager.title === answers.role) roleID = roleAndManager.role_id;
                if (`${roleAndManager.first_name} ${roleAndManager.last_name}` === answers.manager) managerID = roleAndManager.employee_id;
            });
            add.employee(connection, runApp, {firstName: answers.first, lastName: answers.last, roleID: roleID, managerID: managerID});
        })
    });
};

//Function to acquire the necessary data to update a role
const updateRoleInq = () => {
    let employees = [];
    let roles = [];

    connection.query('SELECT employee.id, first_name, last_name, role_id FROM employee', (err, res) => {
        if (err) {
            console.log(`Something went wrong: ${err.message}`);
            runApp();
            return;
        };

        res.forEach(employee => {
            employees.push(`${employee.first_name} ${employee.last_name}`);
        });

        connection.query('SELECT role.id, title FROM role', (error, response) => {
            if (error) {
                console.log(`Something went wrong: ${error.message}`);
                runApp();
                return;
            };

            response.forEach(role => {
                roles.push(role.title);
            });

            inquirer.prompt([{
                type: 'list',
                name: 'employee',
                message: 'Which employee\'s role would you like to update?',
                choices: employees,
                loop: false
            }, {
                type: 'list',
                name: 'role',
                message: 'Select a new role:',
                choices: roles,
                loop: false
            }]).then(answers => {
                let roleID = 0;
                let employeeID = 0;

                response.forEach(role => {
                    if (role.title === answers.role) roleID = role.id;
                });
                res.forEach(employee => {
                    if (`${employee.first_name} ${employee.last_name}` === answers.employee) employeeID = employee.id; 
                });

                update.role(connection, runApp, {roleID: roleID, employeeID: employeeID});
            });
        });
    });
};

//Function to acquire the necessary data to update a manager
const updateManagerInq = () => {
    let employees = [];
    let managers = [];

    connection.query('SELECT employee.id, first_name, last_name, manager_id FROM employee', (err, res) => {
        if (err) {
            console.log(`Something went wrong: ${err.message}`);
            runApp();
            return;
        };

        res.forEach(employee => {
            employees.push(`${employee.first_name} ${employee.last_name}`);
        });

        connection.query('SELECT employee.id, first_name, last_name FROM employee WHERE manager_id = 0', (error, response) => {
            if (error) {
                console.log(`Something went wrong: ${error.message}`);
                runApp();
                return;
            };

            response.forEach(manager => {
                managers.push(`${manager.first_name} ${manager.last_name}`);
            });

            inquirer.prompt([{
                type: 'list',
                name: 'employee',
                message: 'Which employee\'s manager would you like to update?',
                choices: employees,
                loop: false
            }, {
                type: 'list',
                name: 'manager',
                message: 'Select a new manager:',
                choices: managers,
                loop: false
            }]).then(answers => {
                let managerID = 0;
                let employeeID = 0;

                response.forEach(manager => {
                    if (`${manager.first_name} ${manager.last_name}` === answers.manager) managerID = manager.id;
                });
                res.forEach(employee => {
                    if (`${employee.first_name} ${employee.last_name}` === answers.employee) employeeID = employee.id; 
                });

                update.manager(connection, runApp, {managerID: managerID, employeeID: employeeID});
            });
        });
    });
};