const VueCompiler = require('@vue/compiler-sfc')
const getUrlParams = l => new URLSearchParams(l)
module.exports = function (sourceCode) {
    const loaderContext = this
    const params = getUrlParams(loaderContext.resourceQuery)
    const { code } = VueCompiler.compileStyle({
        source: sourceCode,
        id: params.get('id'),
        scoped: !!params.get('id')
    })
    loaderContext.callback(null, code)
}