const mysql = require('mysql')
const util = require('util')
const dbConfig = require('../conf/db.config.js')

const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
})

const sql = {
    /**
     * 
     * @param {string} query 
     * @param {string} args 
     * @returns {object}
     */
    query : (query, args) => {
        return util.promisify( connection.query ).call( connection, query, args );
    },
    close : () => {
        return util.promisify( connection.end ).call( connection );
    }
}

module.exports = sql