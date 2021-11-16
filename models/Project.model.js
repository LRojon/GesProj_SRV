const sql = require('./db')
const Error = require('./Error.model')
const User = require('./User.model')

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
                    let e = (new Error(400, 'NEX', { element: 'user' }))
                    console.log(e.status + ' : ' + e.message)
                }
            }
        })
    }

    static fromRow(row) {
        let users = tasks = postits = links = meetings = [];
        // Grosse requete pour User
        /**
         *  SELECT * FROM User u
         *  JOIN Contribute c
         *  ON c.user = u._id AND c.project = :projectId
         * 
         */
        sql.query("SELECT * FROM User u JOIN Contribute c ON c.user = u._id AND c.project = '" + row._id + "';", (err, uTuples) => {
            if(err) { console.log(err) }
            else {
                for(const tuple in uTuples) {
                    users.push(User.fromRow(tuple))
                }
            }
        })

        return new Project(row._id, row.name, row.overview, row.presentation, row.createdBy, [], [], [], [], [])
    }
}

module.exports = Project