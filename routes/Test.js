const express = require('express')
const router = express.Router()
const sql = require('../models/db')
const Project = require('../models/Project.model')
const Error = require('../models/Error.model')

router.get('/', async (req, res) => {
    sql.query("SELECT * FROM Project WHERE _id = '" + "c81208247b884b48b80e39bae703e295" + "';", (err, tuples) => {
        if(err) { console.log(err) }
        else {
            Project.fromRow(tuples[0])
            res.send('End of test')
        }
    })
})

module.exports = router