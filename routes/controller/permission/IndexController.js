// 新增权限
const POST_ = async (ctx, next) => {
    const { ...permission } = ctx.request.body
    const ret = await ctx.service.permission.add(permission)
    ctx.retJson(ret)
}

module.exports = {
    POST_
}