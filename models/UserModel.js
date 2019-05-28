module.exports = class User {
    constructor(user) {
        this.user = {
            username: '',
            password: '',
            ...user
        }
    }
}