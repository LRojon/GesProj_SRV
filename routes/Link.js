const express = require('express')
const router = express.Router()
const Link = require('../models/Link.model')
const sql = require('../models/db')
const Error = require('../models/Error.model')

/**
 * GET
 * URL: /link/:projectId
 * 
 * params:
 *      projectId: String(32)
 * 
 * Obtient tous les liens contenu dans le projet dont l'id est :projectId
 * 
 */
router.get('/:projectId', (req, res) => {
    if(req.params.projectId.length != 32) {
        (new Error(400, "INC", { id: req.params.projectId })).send(res)
    }
    else {
        let query = "SELECT * FROM LinkAPI WHERE project_id = '" + req.params.projectId + "'"

        sql.query(query, (err, result) => {
            if(err) { console.log(err) }
            else {
                sql.query("SELECT _id FROM Project WHERE _id = '" + req.params.projectId + "';", (err, projects) => {
                    if(err) { console.log(err) }
                    else { 
                        if(projects.length > 0) {
                            console.log(result)
                            if(result.length > 0) {
                                let data = []
                                for(const row of result) {
                                    data.push(Link.fromRow(row))
                                }
                                res.send(data)
                            }
                            else {
                                (new Error(400, "EEM", {
                                    element: 'project',
                                    subElement: 'link'
                                })).send(res)
                            }
                        } 
                        else {
                            (new Error(400, 'NEX', { element: 'project' })).send(res)
                        }
                    }
                })
            }
        })
    }
})

/**
 * POST
 * URL: /link/create
 * 
 * params:
 *      {
 *          label: String,
 *          link: Srting,
 *          project: String(32)
 *      }
 * 
 * Crée un lien, qui sera contenu dans le projet dont l'id est {project}
 * 
 */
router.post('/create', (req, res) => {
    if(req.body.project.length != 32) {
        (new Error(400, 'INC', { id: req.body.project })).send(res)
    }
    else {
        sql.query("SELECT _id FROM Project WHERE _id = '" + req.body.project + "'", async (err, tuples) => {
            if(err) { console.log(err) }
            else {
                if(tuples.length > 0) {
                    let link = await Link.fromRequest(req.body)
                    let query = 'INSERT INTO Link(_id, label, link, project) VALUES("' + link._id + '", "' + link.label + '", "' + link.link + '", "' + link.projectId + '");'
                    sql.query(query, (err, result) => {
                        if(err) { console.log(err) }
                        else {
                            if(result.affectedRows > 0) {
                                res.status(201).send({ message: result })
                            }
                            else {
                                (new Error(500).send(res))
                            }
                        }
                    })
                }
                else {
                    (new Error(400, 'NEX', { element: 'project' })).send(res)
                }
            }
        })
    }
})

/**
 * POST
 * URL: /link/update
 * 
 * params:
 *      {
 *          _id: String(32),
 *          label: String,
 *          link: String
 *      }
 * 
 * Modifie un lien déjà existant
 * 
 */
router.post('/update', (req, res) => {
    if(req.body._id.length != 32) {
        (new Error(400, "INC", { id: req.body._id })).send(res)
    }
    else {
        let link = Link.fromRequest(req.body)
        let query = 'UPDATE Link SET label = "' + link.label + '", link = "' + link.link + '" WHERE _id = "' + link._id + '"'
        sql.query("SELECT _id FROM Link WHERE _id = '" + link._id + "'", (err, tuples) => {
            if(err) { console.log(err) }
            else {
                if(tuples.length > 0) {
                    sql.query(query, (err, result) => {
                        if(err) { console.log(err) }
                        else {
                            if(result.affectedRows > 0) {
                                res.status(200).send({ message: 'Updated successfully !' })
                            }
                            else {
                                (new Error(500)).send(res)
                            }
                        }
                    })
                }
                else {
                    (new Error(400, 'NEX', { element: 'link' })).send(res)
                }
            }
        })
    }
})

/**
 * GET
 * URL: /link/delete/:id
 * 
 * params:
 *      id: String(32)
 * 
 * Supprime le lien qui a pour id :id
 * 
 */
router.get('/delete/:id', (req, res) => {
    if(req.params.id.length != 32) {
        (new Error(400, 'INC', { id: req.params.id })).send(res)
    }
    else {
        sql.query("SELECT _id FROM Link WHERE _id = '" + req.params.id + "'", (err, tuples) => {
            if(err) { console.log(err) }
            else {
                if(tuples.length > 0) {
                    sql.query("DELETE FROM Link WHERE _id = '" + req.params.id + "'", (err, result) => {
                        if(err) { console.log(err) }
                        else {
                            if(result.affectedRows > 0) {
                                res.status(200).send({ message: 'Deleted successfully !' })
                            }
                            else {
                                (new Error(500)).send(res)
                            }
                        }
                    })
                }
                else {
                    (new Error(400, 'NEX', { element: 'link' })).send(res)
                }
            }
        })
    }
})

module.exports = router