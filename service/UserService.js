// 添加用户
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

// 匹配查找用户
const findUser = async (ctx, next, payload) => {
    try {
        const user = await ctx.mdb.findOne('user', payload)
        if (user) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    namespace: 'user',
    service: {
        addUser,
        findUser
    }
}