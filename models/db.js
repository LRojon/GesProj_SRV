const mysql = require('mysql')
const dbConfig = require('../conf/db.config.js')

const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
})

connection.connect(err => {
    if(err) { console.log(err) }
    else { console.log('Successfully connected to the db.'); }
})

module.exports = connection