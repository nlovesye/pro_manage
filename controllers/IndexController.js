const _ = async (ctx, next) => {
    console.log('ctx', ctx.app)
    await ctx.render('index', {
        title: 'nloves'
    })
}

module.exports = {
    _
}