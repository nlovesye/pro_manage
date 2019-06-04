const jwt = require('jsonwebtoken')

// 用户登录
const POST_ = async (ctx, next) => {
    let {
        username,
        password
    } = ctx.request.body
    const user = await ctx.service.user.findUser({ username, password })
    if (user) {
        const exp = Math.floor(Date.now() / 1000) + (60 * 60);
        const token = jwt.sign({
            iss: username,
            exp,
            iat: Date.now()
        }, 'secret')
        const userPermissions = await ctx.service.user.getPermissions({ username })
        let permissions = await ctx.service.permission.get({})
        if (username !== 'admin') {
            permissions = permissions.filter(item => userPermissions && userPermissions.some(code => code === item.code))
        }
        // console.log('token', userPermissions)
        ctx.retJson({
            token,
            username,
            exp,
            permissions
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