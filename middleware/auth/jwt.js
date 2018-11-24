const jwt = require('jsonwebtoken')

module.exports = () => {
    return async (ctx, next) => {
        let token = ((ctx.request.body && ctx.request.body.access_token) || (ctx.query && ctx.query.access_token) || (ctx.header['x-access-token']))
        // console.log('jwtconsole', ctx.request.body, ctx.query.access_token, ctx.header['x-access-token'])
        if (ctx.url.startsWith('/v1.0/api/user/login')) {//如果是用户登录
            await next()
        } else {
            ctx.jsonResult = (obj) => {
                ctx.body = {
                    ...obj
                }
            }
            await next()
        }
    }
}