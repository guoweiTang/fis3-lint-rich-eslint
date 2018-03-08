# fis3-lint-rich-eslint
The fis3-lint-rich-eslint library exported as a [fis3](http://fis.baidu.com/fis3/index.html) plugin.

[![npm](https://img.shields.io/npm/v/fis3-lint-rich-eslint.svg)](https://www.npmjs.com/package/fis3-lint-rich-eslint)
[![node](https://img.shields.io/node/v/fis3-lint-rich-eslint.svg)](https://nodejs.org/en/)
[![npm](https://img.shields.io/npm/dm/fis3-lint-rich-eslint.svg)](https://www.npmjs.com/package/fis3-lint-rich-eslint)

## Installation
``` shell
$ npm install fis3-lint-rich-eslint [--save-dev]
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

#### Eslint:recommended
* 启用推荐的规则,可参考[eslint rules](https://eslint.org/docs/rules/)中标记**√**的属性，推荐的规则可用后续规则覆盖

#### Eslint-config-lagou
* 配置参考[eslint-config-lagou](https://github.com/guoweiTang/eslint-config-lagou)定义

#### Editing rules from within your js
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
