const express = require('express')
const app = express()
const cors = require('cors')

const links = require('./routes/Link')
const users = require('./routes/User')
const test = require('./routes/Test')
const projects = require('./routes/Project')

app.use(express.json())
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header("Content-Type: application/json")
    next()
})

app.use('/link', links)
app.use('/user', users)
app.use('/project', projects)
app.use('/test', test)

app.listen(8102, () => {console.log("App started, and listen on port 8102.")})