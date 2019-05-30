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
            ctx.retErr({
                message: 'CODE或名称或路径已存在!'
            })
        } else {
            return await ctx.mdb.insert(coln, { icon, type, depth, parent, ...rest })
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    namespace: 'permission',
    service: {
        existed,
        add
    }
}