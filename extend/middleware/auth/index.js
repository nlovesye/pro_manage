const jwt = require('jsonwebtoken')

module.exports = () => async (ctx, next) => {
    const token = ((ctx.request.body && ctx.request.body.access_token) || (ctx.query && ctx.query.access_token) || (ctx.header['authorization']))
    // console.log('jwtconsole', ctx.request.body, ctx.query.access_token, ctx.header['x-access-token'])
    if (ctx.url.startsWith('/user/login')) { // 如果是用户登录
        if (token === 'Basic token') {
            await next()
        } else {
            ctx.retErr({
                status: 401,
                message: '登录token错误!'
            })
        }
    } else if (ctx.url.startsWith('/user/regist')) { // 如果是注册
        await next()
    } else {
        try {
            let authInfo = jwt.verify(token, 'secret')
            ctx.userInfo = ctx.userInfo || authInfo
            // console.log('token', token, authInfo, jwt.decode(token))
            await next()
        } catch (error) {
            console.log('auth>>>>>>>', error)
            if (error.name === 'TokenExpiredError' && error.message === 'jwt expired') {
                ctx.retErr({
                    status: 401,
                    message: 'token已过期，请重新获取token!'
                })
            } else {
                ctx.retErr({
                    status: 401,
                    message: 'token验证失败!'
                })
            }
        }
    }
};
