# sass.macro
Have you ever wanted to inline the CSS from arbitrary Sass/SCSS
in your JavaScript? If so, you've come to the right place!

## Installation

```
npm install -D babel-plugin-macros sass.macro
```

## Usage
This module **requires** [babel-plugin-macros] to be installed
and `"macros"` to be listed in the `plugins` array of your
`.babelrc`:

```json
{
  "plugins": [
    "macros"
  ]
}
```

In your code, import the `sass.macro` default export and invoke
it either as a function or tagged template literal:

```js
import sass from 'sass.macro'

const PrimerCSS = sass`
  @import "primer/index.scss";
`

// this is equivalent:

const PrimerCSS = sass('@import "primer/index.scss";')
```

The macro will render the Sass or SCSS code in the provided
string synchronously and replace the `sass` call with a string
literal containing the CSS, so the transformed code will look
like:

```js
const PrimerCSS = "*{box-sizing:border-box}..."
```

## Sass options
1. `outputStyle` is always `"compressed"`
1. `includePaths` is an array of three paths:
    * The current working directory (`process.cwd()`)
    * `node_modules` in the current working directory
    * The directory of the file being parsed

This include paths configuration allows you to reference files
relative to the JavaScript source or your project's top-level
dependencies.

If you have more sophisticated Sass configuration needs, you
should consider using the much more powerful [preval.macro] like
so:

```js
import preval from 'preval.macro'

const css = preval`
  const {renderSync} = require('node-sass')
  const {join} = require('path')
  module.exports = renderSync({
    data: '@import "primer/index.scss";',
    includePaths: [
      __dirname,
      join(process.cwd(), 'node_modules')
    ]
  }).css.toString()
`
```

[babel-plugin-macros]: https://github.com/kentcdodds/babel-plugin-macros
[preval.macro]: https://github.com/kentcdodds/preval.macro
