const sql = require('./db')

class Meeting {
    /**
     * @param {string} _id 
     * @param {string} name 
     * @param {string} place 
     * @param {object} createdBy { _id: string, name: string }
     * @param {object} project { _id: string, name: string }
     */
    constructor(_id, name, place, createdBy, project, invited) {
        this._id = _id
        this.name = name
        this.place = place
        this.createdBy = createdBy
        this.project = project
        this.invited = invited
    }

    /**
     * @returns An array of user who is invited at the meeting
     */
    async #getInvited() {
        let arr = []
        const result = await sql.query("SELECT * FROM InvitedAPI WHERE meeting = '" + this._id + "';")
        for(const i of result) {
            arr.push({
                _id: i.user_id,
                name: i.user,
                status: i.status
            })
        }
        return arr
    }

    /**
     * 
     * @param {object} row { _id: string, name: string, place: string, createdBy: { _id: string, name: string }, project: { _id: string, name:string } }
     * @returns A new instance of Meeting
     */
    static async fromRow(row) {
        let invited = []
        const result = await sql.query("SELECT * FROM InvitedAPI WHERE meeting_id = '" + row._id + "';")
        for(const i of result) {
            invited.push({
                _id: i.user_id,
                name: i.user,
                status: i.status
            })
        }

        return new Meeting(
            row._id,
            row.name,
            row.place,
            {
                _id: row.user_id,
                name: row.createdBy
            },
            {
                _id: row.project_id,
                name: row.project
            },
            invited
        )
    }
}

module.exports = Meeting