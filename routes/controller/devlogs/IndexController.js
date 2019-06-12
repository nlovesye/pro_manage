const coln = 'devlogs'

const catchFun = async (ctx, cb) => {
    try {
        await cb()
    } catch (error) {
        ctx.retErr(error.message)
    }
}

// 获取日志数据
const GET_ = async (ctx, next) => {
    await ctx.catch(async () => {
        const devlogs = await ctx.mdb.find(coln)
        ctx.retJson(devlogs)
    })
}

// 添加日志
const POST_add = async (ctx, next) => {
    await ctx.catch(async () => {
        const params = ctx.request.body
        const now = Date.now()
        const log = {
            ...params,
            createdTime: now,
            updatedTime: now,
            userInfo: ctx.userInfo
        }
        await ctx.mdb.insert(coln, log)
        ctx.retJson("添加成功")
    })
}

module.exports = {
    GET_,
    POST_add
}