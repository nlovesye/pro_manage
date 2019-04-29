module.exports = () => {
    return async (ctx, next) => {
        ctx.retErr = ctx.retErr || ((msg = '服务器错误！', cover = {}) => {
            ctx.response.body = {
                success: false,
                code: 500,
                msg,
                ...cover
            }
        })
        ctx.retJson = ctx.retJson || ((data = "", cover = {}) => {
            ctx.response.body = {
                success: true,
                code: 200,
                msg: 'success!',
                data,
                ...cover
            }
        })
        await next()
    }
}