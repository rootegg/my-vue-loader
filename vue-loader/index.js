const VueCompiler = require('@vue/compiler-sfc')
const hash = require('hash-sum')

const getUrlParams = l => new URLSearchParams(l)
const stringifyRequest = (loaderContext, l) => loaderContext.utils.contextify(loaderContext.context, l)
const getHashId = (filepath, content) => hash(filepath + '-' + content)

module.exports = function (sourceCode) {
    const loaderContext = this
    const { descriptor } = VueCompiler.parse(sourceCode)

    if (!loaderContext.resourceQuery) {
        // 第一次进入loader
        return splitSFC(loaderContext, descriptor, sourceCode)
    }
    else {
        // plugin执行pitch之后，内联方式第二次进入loader
        combineBlock(loaderContext, descriptor, sourceCode)
    }
}

function splitSFC(loaderContext, descriptor, sourceCode) {
    const codes = []
    const filepath = stringifyRequest(loaderContext, loaderContext.resourcePath)
    const isScoped = descriptor.styles.some(it => it.scoped)
    const id = 'data-v-' + getHashId(filepath, sourceCode)
    if (descriptor.styles.length) {
        const scopedQuery = isScoped ? `&id=${id}` : ``
        descriptor.styles.forEach((style, index) => {
            codes.push(`import '${filepath}?vue&type=style&index=${index}${scopedQuery}&lang=css'`)
        })
    }
    if (descriptor.script) {
        codes.push(`import script from '${filepath}?vue&type=script&id=${id}&lang=js'`)
    }

    if (descriptor.template) {
        codes.push(`import { render } from '${filepath}?vue&type=template&id=${id}&lang=js'`)
        codes.push(`script.render = render`)
    }
    codes.push(`script.__scopeId='${id}'`)
    codes.push(`export default script`)
    console.log(codes.join('\n'))
    return codes.join('\n')
}

function combineBlock(loaderContext, descriptor, sourceCode) {
    const params = getUrlParams(loaderContext.resourceQuery)
    const id = params.get('id')

    switch (params.get('type')) {
        case 'template':
            const { code } = VueCompiler.compileTemplate({
                source: descriptor.template.content,
                id: id
            })
            return loaderContext.callback(null, code)
        case 'script':
            const script = VueCompiler.compileScript(descriptor, { id: id })
            return loaderContext.callback(null, script.content)
        case 'style':
            const style = descriptor.styles[params.get('index')].content
            return loaderContext.callback(null, style)
        default:
            return loaderContext.callback(null, sourceCode)
    }
}