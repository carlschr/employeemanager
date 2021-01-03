module.exports = {
    //Route to update employee role
    //Takes a mysql connection, callback function, and data object
    role(connection, cb, data) {
        connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [data.roleID, data.employeeID], (err) => {
            if (err) {
                console.log(`Something went wrong: ${err.message}`);
                cb();
                return;
            };
            console.log('\n', 'Employee role updated.', '\n');
            cb();
        });
    },

    //Route to update employee manager
    //Takes a mysql connection, callback function, and data object
    manager(connection, cb, data) {
        connection.query('UPDATE employee SET manager_id = ? WHERE id = ?', [data.managerID, data.employeeID], (err) => {
            if (err) {
                console.log(`Something went wrong: ${err.message}`);
                cb();
                return;
            };
            console.log('\n', 'Employee manager updated.', '\n');
            cb();
        });
    }
};