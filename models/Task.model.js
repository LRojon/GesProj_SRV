const sql = require('../models/db')

class Task {
    constructor(_id, label, color, commentary, start, end, plannedStart, plannedEnd, state, project, createdAt, createdBy) {
        this._id = _id
        this.label = label
        this.color = color
        this.commentary = commentary
        this.start = start
        this.end = end
        this.plannedStart = plannedStart
        this.plannedEnd = plannedEnd
        this.state = state
        this.project = project
        this.createdAt = createdAt
        this.createdBy = createdBy
    }

    static fromRow(row) {
        return new Task(
            row._id, 
            row.label, 
            row.color, 
            row.commentary, 
            row.start, 
            row.end, 
            row.plannedStart, 
            row.plannedEnd, 
            {
                _id: row.state_id,
                label: row.state
            }, 
            {
                _id: row.project_id,
                name: row.project
            }, 
            row.createdAt, 
            {
                _id: row.user_id,
                name: row.createdBy
            })
    }

    toString() {
        return 'Task ' + this.label + ' (' + this._id + ') from Project ' + this.project.name + ' (' + this.project._id + ').'
    }
}

module.exports = Task