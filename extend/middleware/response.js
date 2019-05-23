module.exports = () => {
    return async (ctx, next) => {
        ctx.retErr = ctx.retErr || ((cover = {}) => {
            // ctx.response.status = cover.code || 500
            ctx.response.body = {
                status: 500,
                message: '服务器错误！',
                success: false,
                ...cover
            }
        })
        ctx.retJson = ctx.retJson || ((data = "", cover = {}) => {
            ctx.response.body = {
                status: 200,
                message: 'success!',
                success: true,
                data,
                ...cover
            }
        })
        await next()
    }
}