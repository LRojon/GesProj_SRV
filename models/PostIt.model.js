const uuid = require("uuid")

class PostIt {   

    /**
     * @param {string} _id 
     * @param {string} label 
     * @param {string} content 
     * @param {object} createdBy { _id: string, name: string }
     * @param {object} project { _id: string, name: string }
     */
    constructor(_id, label, content, createdBy, project) {
        this._id = _id
        this.label = label
        this.content = content
        this.createdBy = createdBy
        this.project = project
    }

    /**
     * @param {object} row { _id : string, label : string, content : string, createdBy : { _id: string, name: string }, project : { _id : string, name : string } }
     * @returns {PostIt} A new instance of PostIt
     */
    static fromRow(row) {
        return new PostIt(
            row._id,
            row.label,
            row.content,
            {
                _id: row.user_id,
                name: row.createdBy
            },
            {
                _id: row.project_id,
                name: row.project
            }
        )
    }
}