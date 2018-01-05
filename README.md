# fis3-lint-rich-eslint
The fis3-lint-rich-eslint library exported as a [fis3](http://fis.baidu.com/fis3/index.html) plugin.

[![npm](https://img.shields.io/npm/v/fis3-lint-rich-eslint.svg)](https://www.npmjs.com/package/fis3-lint-rich-eslint)
[![node](https://img.shields.io/node/v/fis3-lint-rich-eslint.svg)](https://nodejs.org/en/)
[![npm](https://img.shields.io/npm/dm/fis3-lint-rich-eslint.svg)](https://www.npmjs.com/package/fis3-lint-rich-eslint)

## Installation
``` shell
$ npm install fis3-lint-rich-eslint [--save]
```

## Usages
``` js
fis.match('*.js', {
    lint: fis.plugin('rich-eslint'[, options])
})

```
See the **options** what is same as [eslint CLIEngine](https://eslint.org/docs/developer-guide/nodejs-api#cliengine) for more details.

## Default configs
``` js
{
    'fix': false,
    'allowOutfixed': false,
    "envs": [
      "browser",
      "es6",
      "worker",
      "amd",
      "jquery"
    ],
    "globals": [
      "module",
      "exports",
      "__inline",
      "__uri",
      "__RESOURCE_MAP__",
      "fis"
    ],
    "useEslintrc": false,
    "rules": rules
}
```
### allowOutfixed: Boolean | [Boolean, options]
Output the restored file to the directory '/lint-fixed/**', the premise is that the value of fix is true
#### options
* `"root": true` Get root permissions, it will modify the source file，this operation does't promise correctness, so be careful!!!
* `"dirname": '/lint-fixed'` Specify the root directory of the repaired file output

### Rules
As mentioned above, the following is introduce of **rules**:

### Eslint:recommended
* 启用推荐的规则,可参考[eslint rules](https://eslint.org/docs/rules/)中标记**√**的属性，推荐的规则可用后续规则覆盖

#### Spaces

* [warn: indent] 缩进为4个空格
* [warn: semi-spacing] 分号前无空格，后有空格
* [warn: comma-spacing] 逗号前无空格，后有空格
* [warn: space-before-blocks] 语句块之前有空格
* [warn: space-before-function-paren] 函数括号之前不能有空格（匿名函数，命名函数，异步函数）
* [warn: space-infix-ops] 操作符（+，-，*，/）前后有空格
* [warn: space-in-parens] 括号内不存在空格
* [warn: no-multi-spaces] 禁止使用多个空格（非用于缩进）
* [warn: keyword-spacing] 关键字（if，else）前后使用空格
* [warn: key-spacing] 对象字面量的键值前使用空格
* [warn: array-bracket-spacing] 数组内使用空格
* [warn: object-curly-spacing] 对象的花括号内使用空格
* [warn: spaced-comment] 注释“//”或“/*”后必须有空格，除了“-、+、\*”

#### Syntax
* `[error: for-direction] 禁止for无限循环`
* `[error: no-await-in-loop] 禁止循环语句中用await`
* `[error: no-prototype-builtins] 禁止直接调用Object.prototype下的内置属性（方法）`
* `[error: default-case] switch语句必须有default分支`
* `[error: eqeqeq] “===、!==”代替“==、!=”`
* `[error: no-loop-func] 禁止循环中定义函数`
* `[error: no-unmodified-loop-condition] 禁止错误的循环语句，条件值在循环途中并未改变导致无限循环`
* `[error: require-await] async函数必须有await语句`
* [warn: wrap-iife] IIFE需括号包裹函数部分
* [warn: semi] 语句末尾必须添加分号（ASI）
* `[error: guard-for-in] for-in语句中必须有if语句`
* `[error: no-unused-vars] 禁止存在未使用过的变量（函数），除了函数参数为“require,exports,module”`

#### Deprecated or not recommend
* `[error: no-caller] 禁止arguments.caller或arguments.callee`
* [warn: no-eval] 禁止eval语句
* `[error: no-with] 禁止with语句`
* `[error: no-restricted-globals] 禁止event全局变量（用参数形式代替）`

#### Debugging
* [warn: no-alert] 禁止alert、confirm、prompt

#### Others
* [warn: no-extend-native] 禁止扩展原生类型
* `[error: no-new-wrappers] 禁止基本类型用new方式声明`
* `[error: no-param-reassign] 禁止对函数参数再次赋值`
* [warn: no-magic-numbers] 禁止使用魔术数字
* `[error: no-throw-literal] 禁止抛出非error对象`
* `[error: prefer-promise-reject-errors] 禁止非error对象作为Promise.reject的返回值`
* `[error: no-undef-init] 禁止明文初始化变量为undefined`
* [warn: vars-on-top] var声明在作用域顶部
* `[error: no-use-before-define] 禁止变量（函数）定义之前使用它们`
* `[error: no-undefined] 禁止将undefined做为标识符`
* `[error: eol-last] 强制文件结尾必须有空行`
* [warn: arrow-body-style] 当箭头函数的花括号不可省略时必须要有
* [warn: arrow-parens] 箭头函数的参数只有一个可省略圆括号
* `[error: new-cap] 构造函数首字母大写`

#### Editing rules from within your CSS
You can use annotation to add configuration for the specilfied file, like the following:

``` js
/* eslint-env node, mocha */
//dosomething...
```
``` js
/* global var1, var2 */
//dosomething...
```
``` js
/* eslint eqeqeq: "off", curly: "error" */
//dosomething...
```
```js
/* eslint-disable */
alert('foo');
/* eslint-enable */
```
- If you want to know more, please refer to [eslint inline configuration](https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments)
