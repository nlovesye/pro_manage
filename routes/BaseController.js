class BaseController {
    async run (ctx, next) {
        // ctx.app.a = '123'
        console.log(123)
        await next()
    }
}

module.exports = new BaseController()