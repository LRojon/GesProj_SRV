const express = require('express')
const router = express.Router()
const uuid = require('uuid')
const sql = require('../models/db')
const Error = require('../models/Error.model')
const Project = require('../models/Project.model')

/**
 * GET
 * URL: /project/:projectId
 * 
 * params:
 *      projectId: String(32)
 * 
 * Obtient le projet d'id :projectId
 * 
 */
router.get('/:projectId', async (req, res) => {
    if(req.params.projectId.length != 32) { (new Error(400, 'INC', { id: req.params.projectId })).send(res) }

    const result = await sql.query("SELECT * FROM ProjectAPI WHERE _id = '" + req.params.projectId + "';")
    if(result.length < 0) { (new Error(400, 'NEX', { element: 'project' })).send(res) }

    res.status(200).send(await Project.fromRow(result[0]))
})

/**
 * POST
 * URL: /project/create
 * 
 * params:
 *      {
 *          name: String,
 *          createdBy: String(32)
 *      }
 * 
 * Crée un projet et la ligne contribute liant le projet à l'utilisateur qui la créé 
 * 
 */
router.post('/create', async (req, res) => {

    let project = await Project.fromRequest(req.body)

    const insertProject = await sql.query("INSERT INTO Project(_id, name, overview, presentation, createdBy) VALUES (" +
        "\"" + project._id + "\", " + 
        "\"" + project.name + "\", " +
        "\"" + project.overview + "\", " + 
        "\"" + project.presentation + "\", " + 
        "\"" + project.createdBy._id + "\"" + 
    ");")

    const insertContribute = await sql.query("INSERT INTO Contribute(_id, user, project, link, postIt, meeting, task, home, admin) VALUES(" + 
        "\"" + uuid.v4().replaceAll('-', '') + "\", " +
        "\"" + project.createdBy._id + "\", " + 
        "\"" + project._id + "\", " + 
        "1, 1, 1, 1, 1, 1);")

    if(insertProject.affectedRows * insertContribute.affectedRows !== 0) {
        res.status(201).send({ message: 'Project created successfully' })
    }
    else {
        (new Error(500, 'ENL')).send(res)
    }
})

module.exports = router