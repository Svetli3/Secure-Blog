const Pool = require("pg").Pool;

const pool = new Pool({
    host: "localhost",
    user: "hamster",
    port: 5432,
    password: "ayshhJZIy4tCHBrkJRxld5cxLVyIBSt2CWBHJMgffB9POvNqN4",
    database: "postgres"
})

module.exports = pool;