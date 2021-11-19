const sql = require('./db')
const Error = require('./Error.model')
const User = require('./User.model')
const Task = require('./Task.model')

class Project {
    constructor(_id, name, overview, presentation, createdBy, users, tasks, postits, links, meetings){
        this._id = _id
        this.name = name
        this.overview = overview
        this.presentation = presentation
        this.users = users
        this.tasks = tasks
        this.postits = postits
        this.links = links
        this.meetings = meetings
        sql.query("SELECT _id, name FROM User WHERE _id = '" + createdBy + "';", (err, tuples) => {
            if(err) { console.log(err) }
            else {
                try
                {
                    if(tuples.length > 0) {
                        this.createdBy = {
                            _id: tuples[0]._id,
                            name: tuples[0].name
                        }
                    }
                    else {
                        throw (new Error(400, 'NEX', { element: 'user' }))
                    }
                } catch (e) {
                    let err = (new Error(400, 'NEX', { element: 'user' }))
                    console.log(err.status + ' : ' + err.message)
                }
            }
        })
    }

    static async fromRow(row) {
        let users = []
        let tasks = []
        let postits = []
        let links = []
        let meetings = []

        try {
            const result = await sql.query("SELECT * FROM TaskAPI WHERE project = '" + row._id + "';")
            for(const task of result) {
                tasks.push(Task.fromRow(task))
            }
            console.log(tasks)
        } catch(err) {
            console.log(err)
        }

        // Requete retournant tous les user qui contribut à ce projet
        sql.query("SELECT * FROM User u JOIN Contribute c ON c.user = u._id AND c.project = '" + row._id + "';", (err, uTuples) => {
            if(err) { console.log(err) }
            else {
                for(const tuple in uTuples) {
                    users.push(User.fromRow(tuple))
                }
                // Requete retournant toutes les tasks liées au projet
                /*sql.query("SELECT * FROM TaskAPI WHERE project = '" + row._id + "';", (err, tTuples) => {
                    if(err) { console.log(err) }
                    else {
                        for(const tuple in tTuples) {
                            tasks.push(Task.fromRow(tuple))
                        }
                        // Requete retournant les postIts liés au projet
                    }
                })*/
            }
        })

        return new Project(row._id, row.name, row.overview, row.presentation, row.createdBy, [], [], [], [], [])
    }
}

module.exports = Project