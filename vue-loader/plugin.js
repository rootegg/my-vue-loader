const path = require('path')

const getUrlParams = l => new URLSearchParams(l)
class Plugin {
    apply(complier) {
        const rules = complier.options.module.rules
        const pitcher = {
            loader: require.resolve('./pitcher.js'),
            resourceQuery(query) {
                const params = getUrlParams(query)
                return params.get('vue') !== null
            }
        }

        let currentResourcePath
        const cloneRules = rules.map(it => {
            const res = {
                ...it,
                resource(resource) {
                    currentResourcePath = resource
                    return true
                },
                resourceQuery(query) {
                    const params = getUrlParams(query)
                    if (params.get('vue') != null) {
                        const url = currentResourcePath + '.' + params.get('lang')
                        return it.test.test(url)
                    }
                }
            }
            delete res.test
            return res
        })

        complier.options.module.rules = [
            pitcher,
            ...cloneRules,
            ...rules
        ]
    }
}

module.exports = Plugin