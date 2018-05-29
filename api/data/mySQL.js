const mysql = require('mysql')
const config = require('../config')

const pool = mysql.createPool({
    connectionLimit: config.tvShowsMySQLInfo.connectionLimit,
    host: config.tvShowsMySQLInfo.host,
    user: config.tvShowsMySQLInfo.user,
    password: config.tvShowsMySQLInfo.password,
    database: config.tvShowsMySQLInfo.database,
    debug: config.tvShowsMySQLInfo.debug
})

module.exports = {
    getPool: pool
}
