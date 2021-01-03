module.exports = {
    //Function to add a new department
    department(connection, cb, data) {
        connection.query('INSERT INTO department (department_name) VALUES (?)', [data.name], (err) => {
            if (err) {
                console.log(`Something went wrong: ${err.message}`);
                cb();
                return;
            };
            console.log('Department created.');
            cb();
        });
    },

    role(connection, cb, data) {
        connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [data.title, data.salary, data.deptID], (err) => {
            if (err) {
                console.log(`Something went wrong: ${err.message}`);
                cb();
                return;
            };
            console.log('Role created.');
            cb();
        });
    },

    employee(connection, cb, data) {
        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [data.firstName, data.lastName, data.roleID, data.managerID], (err, res) => {
            if (err) {
                console.log(`Something went wrong: ${err.message}`);
                cb();
                return;
            };
            console.log('Employee added.');
            cb();
        });
    }
};