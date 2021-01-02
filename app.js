const sql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const view = require('./view');

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
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'View Managers', 'Add Department', 'Add Role', 'Add Employee', 'Quit'],
        loop: false
    })
    .then(answer => {
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
                break;
            case 'Add Role':
                break;
            case 'Add Employee':
                break;
            case 'Quit':
                console.log('Goodbye.')
                connection.end();
                break;
            //If something goes wrong, it reruns the app
            default:
                runApp();
                break;
        };
    });
};

