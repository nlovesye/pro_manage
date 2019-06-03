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

// 获取所有用户
const findAll = async (ctx, next) => {
    try {
        const list = await ctx.mdb.find('user', {})
        if (list) {
            return list
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

// 获取用户权限
const getPermissions = async (ctx, next, params) => {
    try {
        const user = await ctx.mdb.findOne('user', { ...params })
        if (user && user.permissions) {
            return user.permissions
        } else {
            return []
        }
    } catch (error) {
        return false
    }
}

// 更新用户权限
const updatePermission = async (ctx, next, { username, codes }) => {
    try {
        await ctx.mdb.updateOne('user', { username }, { permissions: codes })
        return true
    } catch (error) {
        return { message: '服务器错误!' }
    }
}

module.exports = {
    namespace: 'user',
    service: {
        addUser,
        findUser,
        findAll,
        getPermissions,
        updatePermission
    }
}