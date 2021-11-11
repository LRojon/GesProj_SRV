const sql = require('./db')
const uuid = require('uuid')

class Link {
    constructor(_id, label, link, projectId, project) {
        this._id = _id
        this.label = label
        this.link = link
        this.projectId = projectId
        this.project = project
    }
    static fromRow(row) {
        return new Link(row._id, row.label, row.link, row.project_id, row.project)
    }
    static fromRequest(body) {
        return new Link(
            body._id ? body._id : uuid.v4().replaceAll('-', ''), 
            body.label ? body.label : '', 
            body.link ? body.link : '', 
            body.project ? body.project : '', 
            '')
    }
}

module.exports = Link