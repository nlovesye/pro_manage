const jwt = require('jsonwebtoken')

// 用户登录
const POST_ = async (ctx, next) => {
    let user = await ctx.mdb.findOne('user', { username: 'nloves' })
    ctx.body = user
    await next()
}

module.exports = {
    POST_
}