class BController {
    constructor() {
        this.name = 'b'
    }
    getName () {
        return this.name
    }
}

module.exports = {
    b: new BController()
}