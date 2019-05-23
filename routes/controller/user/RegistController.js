// 用户注册
const POST_ = async (ctx, next) => {
    // console.log(ctx.service.addUser)
    let {
        username,
        password
    } = ctx.request.body
    await ctx.service.user.addUser({ username, password })
}

module.exports = {
    POST_
}