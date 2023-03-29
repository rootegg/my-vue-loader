const pitcher = code => code
const stringifyRequest = (loaderContext, l) => loaderContext.utils.contextify(loaderContext.context, l)
const getUrlParams = l => new URLSearchParams(l)
pitcher.pitch = function () {
    const loaderContext = this
    const params = getUrlParams(loaderContext.resourceQuery)
    const loaders = loaderContext.loaders.filter(it => it.path != __filename)
    if (params.get('type') == 'style' && params.get('id')) {
        // 特殊处理style的scoped
        const cssLoaderIndex = loaders.findIndex(it => /css-loader/.test(it.path))
        loaders.splice(cssLoaderIndex + 1, 0, require.resolve('./stylePostLoader.js'))
    }
    const loadersStrings = loaders.map(loader => loader.request || loader)
    const inlineLoader = stringifyRequest(loaderContext, "!!" + [...loadersStrings, loaderContext.resourcePath + loaderContext.resourceQuery].join('!'))
    return params.get('type') == 'template' ? `export * from '${inlineLoader}'` : `export { default } from '${inlineLoader}'`
}
module.exports = pitcher