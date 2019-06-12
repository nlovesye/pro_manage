module.exports = () => {
    return async (ctx, next) => {
        ctx.catch = ctx.catch || (async (cb) => {
            // ctx.response.status = cover.code || 500
            try {
                await cb()
            } catch (error) {
                ctx.retErr(error.message)
            }
        })
        await next()
    }
}