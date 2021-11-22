const sql = require('./db')
const uuid = require('uuid')

class Link {
    constructor(_id, label, link, project) {
        this._id = _id
        this.label = label
        this.link = link
        this.project = project
    }
    static fromRow(row) {
        return new Link(row._id, row.label, row.link,{ _id: row.project_id, name: row.project })
    }
    static fromRequest(body) {
        const result = sql.query("SELECT _id, name FROM Project WHERE _id = '" + body.project + "';")

        return new Link(
            body._id ? body._id : uuid.v4().replaceAll('-', ''), 
            body.label ? body.label : '', 
            body.link ? body.link : '', 
            body.project ? { 
                _id: result[0]._id,
                name: result[0].name
            } : null, 
            '')
    }
}

module.exports = Link