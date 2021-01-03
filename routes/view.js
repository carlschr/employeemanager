const cTable = require('console.table');

module.exports = {
    //Function to retrieve a list of departments
    //Takes a mysql connection and a callback function
    allDepts(connection, cb){
        connection.query('SELECT * FROM department', (err, res) => {
            if (err) {
                console.log(`Something went wrong: ${err.message}`);
                cb();
                return;
            };
            console.log('\n');
            console.table(res);

            cb();
        });
    },

    //Function to view roles
    //Takes a mysql connection and a callback function
    allRoles(connection, cb) {
        connection.query('SELECT * FROM role', (err, res) => {
            if (err) {
                console.log(`Something went wrong: ${err.message}`);
                cb();
                return;
            };

            console.log('\n');
            console.table(res);

            cb();
        });
    },

    //Function to retrieve a list of all employees
    //Takes a mysql connection and a callback function
    allEmployees(connection, cb) {
        //Query selects columns from all three tables and orders by last name
        connection.query('SELECT employee.id, first_name, last_name, title, department_name, salary, manager_id FROM employee LEFT JOIN role ON role_id = role.id INNER JOIN department ON department.id = department_id ORDER BY employee.last_name', (err, res) => {
            if (err) {
                console.log(`Something went wrong: ${err.message}`);
                cb();
                return;
            };
            //Two loops compare the employees and pull the matching manager name for each manager_id
            res.forEach(employee => {
                res.forEach(otherEmployee => {
                    //If the manager_id is already deleted it moves to the next employee
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

            cb();
        });
    },

    //Function to only retrieve employees whose manager_id is 0
    //If an employee has yet to be assigned to a manager, they will also appear here
    //Takes a mysql connection and a callback function
    allManagers(connection, cb) {
        connection.query('SELECT employee.id, first_name, last_name, title, salary FROM employee LEFT JOIN role ON role_id = role.id WHERE manager_id = 0', (err, res) => {
            if (err) {
                console.log(`Something went wrong: ${err.message}`);
                cb();
                return;
            };

            console.log('\n');
            console.table(res);

            cb();
        });
    }
};