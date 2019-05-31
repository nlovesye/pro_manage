const coln = 'permissions'

// 条件匹配查找权限是否存在
const existed = async (ctx, next, validArr) => {
    try {
        const ret = await ctx.mdb.find(coln, { $or: validArr })
        if (ret && ret.length) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return true
    }
}

// 获取permissions列表
const get = async (ctx, next, payload) => {
    try {
        const ret = await ctx.mdb.find(coln, payload)
        return ret
    } catch (error) {
        return '系统错误!'
    }
}

// 新增一条权限
const add = async (ctx, next, { icon, type, depth, parent, ...rest }) => {
    try {
        let validArr = []
        for (const key in rest) {
            if (rest.hasOwnProperty(key)) {
                validArr.push({ [key]: rest[key] })
            }
        }
        const isExist = await existed(ctx, next, validArr)
        if (isExist) {
            return {
                message: 'CODE或名称或路径已存在!'
            };
        } else {
            await ctx.mdb.insert(coln, { icon, type, depth, parent, ...rest })
            return true
        }
    } catch (error) {
        return {
            message: '服务器错误!'
        };
    }
}

// 根据CODE更新权限
const update = async (ctx, next, { code, title, path, icon }) => {
    try {
        await ctx.mdb.updateOne(coln, { code }, { $set: { title, path, icon } })
        return true
    } catch (error) {
        return { message: '服务器错误!' }
    }
}

// 根据CODE删除权限
const del = async (ctx, next, { code }) => {
    try {
        await ctx.mdb.removeOne(coln, { code })
        return true
    } catch (error) {
        return { message: '服务器错误!' } 
    }
}

module.exports = {
    namespace: 'permission',
    service: {
        existed,
        add,
        update,
        get,
        del
    }
}