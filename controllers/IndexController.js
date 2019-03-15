const _ = async (ctx, next) => {
    await ctx.render('demo', {
        title: 'nloves'
    })
}

module.exports = {
    _
}