const express = require('express')
const router = express.Router()
const sql = require('../models/db')
const User = require('../models/User.model')

router.get('/:userId', (req, res) => {
    if(req.params.userId.length != 32) { res.status(400).send({ message: 'Wrong user id.' }) }
})