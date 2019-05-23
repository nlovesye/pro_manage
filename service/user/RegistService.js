// 注册用户
const addUser = async (ctx, next, user) => {
    if (user) {
        const u = await ctx.mdb.findOne('user', { username: user.username })
        if (u) {
            ctx.retErr({
                message: '用户名已存在!'
            })
            return
        }
        await ctx.mdb.insert('user', user)
        ctx.retJson(user)
    } else {
        ctx.retErr({
            message: '用户名和密码必填'
        })
    }
}

module.exports = {
    namespace: 'user',
    service: {
        addUser
    }
}