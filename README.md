# fis3-lint-rich-eslint
The fis3-lint-rich-eslint library exported as a fis3 plugin.
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
See the **options** what is same as [eslint's CLIEngine](https://eslint.org/docs/developer-guide/nodejs-api#cliengine) for more details.

## Default configs
``` js
{
    "envs": [
      "browser",
      "es6",
      "worker",
      "amd",
      "jquery"
    ],
    "globals": [
      "__inline",
      "__uri",
      "__RESOURCE_MAP__",
      "fis"
    ],
    "useEslintrc": false,
    "rules": rules
}
```
As mentioned above, the following is introduce of **rules**:

#### Spaces

* 警告缩进4个空格
* 警告分号之前没空格，分号之后有空格
* 警告语句块之前必须有空格
* 警告函数括号之前必须有空格（匿名函数，命名函数，异步函数）
* 警告要求操作符（+，-，*，/）周围有空格
* 警告括号内不存在空格
* 警告使用多个空格（非用于缩进）
* 警告强制在关键字（if，else）前后使用空格
* 警告对象字面量的键值前使用空格

#### Syntax
* `禁止for无限循环`
* `禁止循环语句中用await`
* `禁止直接调用Object.prototype下的内置属性（方法）`
* `禁止switch语句必须有default分支`
* `禁止“===、!==”代替“==、!=”`
* `禁止循环中定义函数`
* `禁止错误的循环语句，条件值在循环途中并未改变导致无限循环`
* `禁止不存在await语句的async函数`
* 警告IIFE需括号包裹函数部分

#### Will be discarded or not recommend
* `禁止arguments.caller或arguments.callee`
* 警告eval语句
* `禁止with语句`
* `禁止event全局变量（用参数形式代替）`

#### Debugging
* 警告alert、confirm、prompt

#### Others
* 警告扩展原生类型
* `禁止基本类型用new方式声明`
* `禁止对函数参数再次赋值`
* 警告使用魔术数字
* `禁止抛出非error对象`
* `禁止非error对象作为Promise.reject的返回值`
* `禁止明文初始化变量为undefined`
* 警告var声明在作用域顶部
* `禁止变量（函数）定义之前使用它们`
* `禁止将undefined做为标识符`
* `强制文件结尾必须有空行`
* 警告当箭头函数的花括号不可省略时必须要有
* 警告箭头函数的参数只有一个可省略圆括号
* `禁止构造函数首字母不是大写`

