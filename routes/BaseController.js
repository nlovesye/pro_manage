class BaseController {
    async run (ctx, next) {
        // ctx.app.a = '123'
        await next()
    }
}

module.exports = new BaseController()