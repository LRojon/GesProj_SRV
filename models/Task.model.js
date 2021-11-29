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

    /**
     * Remove this meeting and all invitation
     * 
     * @returns {int} The number of affected rows
     */
     async delete() {
        let row = 0

        const result = await sql.query("DELETE FROM Affected_At WHERE task = '" + this._id + "';")
        if(result.affectedRows > 0) {
            row += result.affectedRows
            const res = await sql.query("DELETE FROM Task WHERE _id = '" + this._id + "';")
            if(res.affectedRows > 0) { return res.affectedRows + row }
            else { return 0 }
        }
        else {
            return 0
        }
    }

    toString() {
        return 'Task ' + this.label + ' (' + this._id + ') from Project ' + this.project.name + ' (' + this.project._id + ').'
    }
}

module.exports = Task