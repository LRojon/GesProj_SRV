const sql = require('./db')
const uuid = require('uuid')
const Error = require('./Error.model')
const User = require('./User.model')
const Task = require('./Task.model')
const Link = require('./Link.model')
const PostIt = require('./PostIt.model')
const Meeting = require('./Meeting.model')

class Project {
    /**
     * 
     * @param {string} _id a string of exactly 32 char
     * @param {string} name 
     * @param {string} overview 
     * @param {string} presentation 
     * @param {object} createdBy { _id: string, name: string }
     * @param {array} users 
     * @param {array} tasks 
     * @param {array} postits 
     * @param {array} links 
     * @param {array} meetings 
     */
    constructor(_id, name, overview, presentation, createdBy, users, tasks, postits, links, meetings){
        this._id = _id
        this.name = name
        this.overview = overview
        this.presentation = presentation
        this.createdBy = createdBy
        this.users = users
        this.tasks = tasks
        this.postits = postits
        this.links = links
        this.meetings = meetings
    }

    static async fromRow(row) {
        let users = []
        let tasks = []
        let postits = []
        let links = []
        let meetings = []
        let createdBy = {}

        try {
            // Requete retournant tous les user qui contribut à ce projet
            let result = await sql.query("SELECT * FROM User u JOIN Contribute c ON c.user = u._id AND c.project = '" + row._id + "';")
            for(const user of result) {
                users.push(User.fromRow(user))
            }

            // Requete retournant toutes les tasks liées au projet
            result = await sql.query("SELECT * FROM TaskAPI WHERE project_id = '" + row._id + "';")
            for(const task of result) {
                tasks.push(Task.fromRow(task))
            }

            // Requete retournant touts les postIts liés au projet
            result = await sql.query("SELECT * FROM PostItAPI WHERE project_id ='" + row._id + "';")
            for(const postIt of result) {
                postits.push(PostIt.fromRow(postIt))
            }

            // Requete retournant touts les liens liés au projet
            result = await sql.query("SELECT * FROM LinkAPI WHERE project_id = '" + row._id + "';")
            for(const link of result) {
                links.push(Link.fromRow(link))
            }

            // Requete retournant toutes les réunion liées au projet
            result = await sql.query("SELECT * FROM MeetingAPI WHERE project_id = '" + row._id + "';")
            for(const meeting of result) {
                meetings.push(await Meeting.fromRow(meeting))
            }

            createdBy = {
                _id: row.user_id,
                name: row.createdBy
            }
        } catch(err) {
            console.log(err)
        }

        return new Project(row._id, row.name, row.overview, row.presentation, createdBy, users, tasks, postits, links, meetings)
    }

    static async fromRequest(body) {
        const user = await sql.query("SELECT _id, name FROM User WHERE _id = '" + body.createdBy + "';")
        let ret = {
            _id: body._id ? body._id : uuid.v4().replaceAll('-', ''),
            name: body.name || body.name !== '' ? body.name : 'Nouveau Projet',
            presentation: body.presentation ? body.presentation : 'C\'est un nouveau projet qui commence !!!',
            overview: body.overview ? body.overview : 'C\'est un nouveau projet qui commence !!! <br> Détaillé le ici !',
            user_id: user.length > 0 ? user[0]._id : null,
            createdBy : user.length > 0 ? user[0].name : null
        }

        return await Project.fromRow(ret)
    }
}

module.exports = Project