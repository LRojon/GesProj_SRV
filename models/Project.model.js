const sql = require('./db')
const Error = require('./Error.model')
const User = require('./User.model')
const Task = require('./Task.model')
const Link = require('./Link.model')
const PostIt = require('./PostIt.model')
const Meeting = require('./Meeting.model')

class Project {
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

    async #getCreatedBy(createdBy) {
        const result = await sql.query("SELECT _id, name FROM User WHERE _id = '" + createdBy + "';")
        return {
            _id: result[0]._id,
            name: result[0].name
        }
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

            result = await sql.query("SELECT _id, name FROM User WHERE _id = '" + row.createdBy + "';")
            createdBy = {
                _id: result[0]._id,
                name: result[0].name
            }
        } catch(err) {
            console.log(err)
        }

        return new Project(row._id, row.name, row.overview, row.presentation, createdBy, users, tasks, postits, links, meetings)
    }
}

module.exports = Project