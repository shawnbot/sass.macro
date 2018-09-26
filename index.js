const sass = require('node-sass')
const {createMacro} = require('babel-plugin-macros')
const {dirname, join} = require('path')

module.exports = createMacro(sassMacro)

function sassMacro({references, state, babel}) {
  const t = babel.types
  const {cwd, filename} = state

  function renderToString(options) {
    const result = sass.renderSync(
      Object.assign(
        {
          outputStyle: 'compressed',
          includePaths: [cwd, join(cwd, 'node_modules'), dirname(filename)]
        },
        options
      )
    )
    return result.css.toString()
  }

  for (const ref of references.default) {
    const path = ref.parentPath
    let value
    switch (path.type) {
      case 'CallExpression':
        value = path.node.arguments[0].value
        break
      case 'TaggedTemplateExpression':
        value = path.node.quasi.quasis[0].value.cooked
        break
      default:
        throw new SyntaxError(
          `Invalid sass.macro invocation: "${path.type}"; expected CallExpression or TaggedTemplateExpression`
        )
    }
    const css = renderToString({data: value})
    path.replaceWith(t.stringLiteral(css))
  }
}
