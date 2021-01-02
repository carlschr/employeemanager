const sql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

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
        console.error(err);
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
        choices: ['View All Departments', 'View All Employees', 'View Managers']
    })
    .then(answer => {
        switch (answer.actions) {
            case 'View All Departments':
                allDepts();
                break;
            case 'View All Employees':
                allEmployees();
                break;
            case 'View Managers':
                break;
            default:
                runApp();
                break;
        };
    });
};

const allDepts = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.error(err);
            runApp();
        };
        console.log('\n');
        console.table(res);
    });
};

const allEmployees = () => {
    connection.query('SELECT employee.id, first_name, last_name, title, department_name, salary, manager_id FROM employee LEFT JOIN role ON role_id = role.id INNER JOIN department ON department.id = department_id ORDER BY employee.last_name', (err, res) => {
        if (err) {
            console.error(err);
            runApp();
        };
        res.forEach(employee => {
            res.forEach(otherEmployee => {
                if (employee.hasOwnProperty('manager_id')) {
                    if (employee.manager_id === otherEmployee.id) {
                        employee.manager = `${otherEmployee.first_name} ${otherEmployee.last_name}`;
                        delete employee.manager_id;
                    } else if (employee.manager_id === 0) {
                        employee.manager = null;
                        delete employee.manager_id;
                    };
                };
            });
        });
        console.log('\n');
        console.table(res);
    });
};