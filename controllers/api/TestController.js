const GET_test = async (ctx, next) => {
    ctx.body = 'hello'
}

const POST_ = async (ctx, next) => {
    console.log(ctx.jsonResult)
    ctx.jsonResult({
        info: 'hello'
    })
}

module.exports = {
    GET_test,
    POST_
}