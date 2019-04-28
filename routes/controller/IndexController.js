const GET_ = async (ctx, next) => {
    await ctx.render('index', {
        title: 'koa2!'
    })
}

module.exports = {
    GET_
}