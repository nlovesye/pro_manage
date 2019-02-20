const _ = async (ctx, next) => {
    await ctx.render('admin/index', {
        title: '后台管理'
    })
}

module.exports = {
    _
}