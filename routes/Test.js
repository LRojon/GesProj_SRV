const express = require('express')
const router = express.Router()
const sql = require('../models/db')
const Project = require('../models/Project.model')
const Error = require('../models/Error.model')
const Link = require('../models/Link.model')

router.get('/', (req, res) => {
    sql.query("SELECT * FROM Project WHERE _id = '" + "c81208247b884b48b80e39bae703e295" + "';", async (err, tuples) => {
        if(err) { console.log(err) }
        else {
            let p = await Project.fromRequest({
                name: 'Test',
                createdBy: 'e161b00670324d87ac20082fa25e681f'
            })
            console.log(p)
            res.send('End of test')
        }
    })
})

module.exports = router