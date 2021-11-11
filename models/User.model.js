class User {
    constructor(_id, name, password, mail, notification, theme, lastOpenned, projects) {
        this._id = _id
        this.name = name
        this.password = password
        this.mail = mail
        this.notification = notification
        this.theme = theme
        this.lastOpenned = lastOpenned
        this.projects = projects
    }
    static fromRow(row) {
        return new User(row._id, row.name, row.password, row.mail, row.notification, row.theme, row.lastOpenned, [])
    }
    static fromRow(row, projects) {
        return new User(row._id, row.name, row.password, row.mail, row.notification, row.theme, row.lastOpenned, projects)
    }
}