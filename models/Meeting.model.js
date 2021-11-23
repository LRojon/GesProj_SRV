const sql = require('./db')

class Meeting {
    /**
     * @param {string} _id 
     * @param {string} name 
     * @param {string} place 
     * @param {object} createdBy { _id: string, name: string }
     * @param {object} project { _id: string, name: string }
     */
    constructor(_id, name, place, createdBy, project) {
        this._id = _id
        this.name = name
        this.place = place
        this.createdBy = createdBy
        this.project = project
        this.invited = []

        const result = await sql.query("SELECT * FROM InivitedAPI WHERE meeting = '" + this._id + "';")
        for(const i of result) {
            this.invited.push({
                _id: i.user_id,
                name: i.user,
                status: i.status
            })
        }
    }

    /**
     * 
     * @param {object} row { _id: string, name: string, place: string, createdBy: { _id: string, name: string }, project: { _id: string, name:string } }
     * @returns A new instance of Meeting
     */
    static fromRow(row) {
        return new Meeting(
            row._id,
            row.name,
            row.place,
            {
                _id: row.user_id,
                name: row.user
            },
            {
                _id: row.project_id,
                name: row.project
            }
        )
    }
}

module.exports = Meeting