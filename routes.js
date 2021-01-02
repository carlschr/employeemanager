const sql = require('mysql');
const table = require('console.table');

class Route { 
    constructor(sql, params){
    this.sql = sql;
    this.params = params;
    }
    use() {
        connection.query(this.sql, this.params, (err, res) => {
            console.table(response);
        });
    }
};

const allDepts = new Route('SELECT * FROM department');
module.exports = {allDepts};