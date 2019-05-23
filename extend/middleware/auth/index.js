const koaJwt = require('koa-jwt')

module.exports = () => async (ctx, next) => {
    let token = ((ctx.request.body && ctx.request.body.access_token) || (ctx.query && ctx.query.access_token) || (ctx.header['authorization']))
        // console.log('jwtconsole', ctx.request.body, ctx.query.access_token, ctx.header['x-access-token'])
    if (ctx.url.startsWith('/user/login')) {//如果是用户登录
        if (token === 'Basic token') {
            await next()
        } else {
            ctx.retErr({
                code: 401,
                message: '登录token错误'
            })
        }
    } else {
        // const auth = koaJwt.decode(token.split(' ')[1], 'jwt_nloves')
        console.log('token', token)
        await next()
    }
};
