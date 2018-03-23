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

/**
 * The tool exposes an object containing the exception information through the 'fis.set("ESLINT_RESULT",obj)' method.
 * Get it through 'fis.get("ESLINT_RESULT")' method,
 * and it has two attributes that are 'errCount' and 'totalCount', as follows:
 */
fis.match('::package', {
    prepackager: function(content, file, settings) {
        let eslintErrCount = fis.get('ESLINT_RESULT.errCount');
        
        // Exit the program when there is a eslint error.
        if (eslintErrCount) {
            process.exit()
        }
        
        return content;
    }
})
```
See the **options** what is same as [eslint CLIEngine](https://eslint.org/docs/developer-guide/nodejs-api#cliengine) for more details.

## Default configs
``` js
{
    'fix': false,
    'allowOutfixed': false,
    'envs': [
      'browser',
      'es6',
      'worker',
      'amd',
      'jquery'
    ],
    'globals': [
      'module',
      'exports',
      '__inline',
      '__uri',
      '__RESOURCE_MAP__',
      'fis'
    ],
    'ignoreFiles': [
        'bower_components/**',
        'node_modules/**',
        'lint-fixed/**',
        'js-conf.js'
    ],
    'useEslintrc': false,
    'rules': rules
}
```
### allowOutfixed: Boolean | [Boolean, options]
Output the restored file to the directory '/lint-fixed/**', the premise is that the value of fix is true.
#### options
* `'root': true` Get root permissions, it will modify the source file，this operation does't promise correctness, so be careful!!!
* `'dirname': '/lint-fixed'` Specify the root directory of the repaired file output
### ignoreFiles: [String]
 [Glob](https://github.com/isaacs/node-glob) patterns for paths to ignore.
 **Be careful the property named `ignorePattern` is discarded.**

### Rules
As mentioned above, the following is introduce of **rules**:

#### Eslint:recommended
* The rule of ['eslint:recommended'](https://eslint.org/docs/rules/) that has the right mark is enabled by default. 

#### Eslint-config-lagou
* The rule of ['eslint-config-lagou'](https://github.com/guoweiTang/eslint-config-lagou) is enabled by default

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
/* eslint eqeqeq: 'off', curly: 'error' */
//dosomething...
```
```js
/* eslint-disable */
alert('foo');
/* eslint-enable */
```
- If you want to know more, please refer to [eslint inline configuration](https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments)
