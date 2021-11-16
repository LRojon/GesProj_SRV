const sql = require('./db')
const Error = require('./Error.model')

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
                } catch ()
            }
        })
    }
}

module.exports = Project