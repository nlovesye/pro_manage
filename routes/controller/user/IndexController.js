// 获取用户列表
const GET_ = async (ctx, next) => {
    // const { ...permission } = ctx.request.body
    const ret = await ctx.service.user.findAll({})
    if (ret) {
        ctx.retJson(ret)
    } else {
        ctx.retErr("服务器错误!")
    }
}

// 根据用户名获取拥有权限
const POST_permissions = async (ctx, next) => {
    const ret = await ctx.service.user.getPermissions(ctx.request.body)
    if (ret) {
        ctx.retJson(ret)
    } else {
        ctx.retErr("服务器错误!")
    }
}

// 更新用户权限
const POST_updatePermission = async (ctx, next) => {
    const ret = await ctx.service.user.updatePermission(ctx.request.body)
    if (ret === true) {
        ctx.retJson("更新成功!")
    } else {
        ctx.retErr(ret)
    }
}

module.exports = {
    GET_,
    POST_permissions,
    POST_updatePermission
}