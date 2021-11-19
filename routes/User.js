const express = require('express')
const router = express.Router()
const sql = require('../models/db')
const User = require('../models/User.model')
const Error = require('../models/Error.model')

router.get('/:userId', (req, res) => {
    if(req.params.userId.length != 32) { (new Error(400, 'INC', { id: req.params.userId })).send(res) }
    else {
        sql.query("SELECT * FROM User WHERE _id = '" + req.params.userId + "';", (err, tuples) => {
            if(err) { console.log(err) }
            else {
                if(tuples.length > 0) {
                    
                }
                else {
                    (new Error(400, 'NEX', { element: 'User' })).send(res)
                }
            }
        })
    }
})

module.exports = router