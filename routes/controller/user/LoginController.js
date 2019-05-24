const jwt = require('jsonwebtoken')

// 用户登录
const POST_ = async (ctx, next) => {
    let {
        username,
        password
    } = ctx.request.body
    const user = await ctx.service.user.findUser({ username, password })
    if (user) {
        const token = jwt.sign({
            iss: username,
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            iat: Date.now()
        }, 'secret')
        // console.log('token', token)
        ctx.retJson({
            token,
            username
        })
    } else {
        ctx.retErr({
            message: '用户名或密码错误!'
        })
    }
}

module.exports = {
    POST_
}