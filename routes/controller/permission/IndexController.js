const dealFun = function (ret, ctx, data) {
    if (ret === true) {
        ctx.retJson(data || null)
    } else {
        ctx.retErr(ret)
    }
}

// 新增权限
const POST_add = async (ctx, next) => {
    const { ...permission } = ctx.request.body
    const ret = await ctx.service.permission.add(permission)
    const permissions = await ctx.service.permission.get({})
    dealFun(ret, ctx, permissions)
}

// 编辑权限
const POST_update = async (ctx, next) => {
    const ret = await ctx.service.permission.update(ctx.request.body)
    const permissions = await ctx.service.permission.get({})
    dealFun(ret, ctx, permissions)
}

// 删除权限
const POST_remove = async (ctx, next) => {
    const ret = await ctx.service.permission.del(ctx.request.body)
    const permissions = await ctx.service.permission.get({})
    dealFun(ret, ctx, permissions)
}

module.exports = {
    POST_add,
    POST_update,
    POST_remove
}