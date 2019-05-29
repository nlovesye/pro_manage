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
            username,
            permissions: [
                {
                    title: '系统配置',
                    path: 'system',
                    code: 1,
                    depth: 0,
                    parent: 0
                },
                {
                    title: '权限管理',
                    path: 'system_permissions',
                    code: 101,
                    depth: 1,
                    parent: 1
                },
                {
                    title: '测试',
                    path: 'test',
                    code: 2,
                    depth: 0,
                    parent: 0
                },
            ]
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