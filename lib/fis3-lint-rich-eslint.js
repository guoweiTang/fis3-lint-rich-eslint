
function eslintIgnore(file, conf) {
    var ignored = [];

    if (conf.ignoreFiles) {
        var ignoreFiles = conf.ignoreFiles;
        if (ignoreFiles.constructor === String || ignoreFiles.constructor === RegExp) {
            ignored = [ignoreFiles];
        } else if (ignoreFiles.constructor === Array) {
            ignored = ignoreFiles;
        }
        //delete custom eslintConfig property
        delete conf.ignoreFiles;
    }
    var len = ignored.length;
    if (len) {
        for (var i = 0; i < len; i++) {
            if (fis.util.filter(file.subpath, ignored[i])) {
                return true;
            }
        }
    }
    return false;
}

/**
 * make array value unique
 * @param  {Array} arr A array which would be checked
 * @return {Array}     A new array which has unique value
 */
function makeArrItemUnique(arr) {
    var tmpArr = [],
        tmpObj = {},
        tmp;
    for (var i = 0, len; i < arr.length; i++) {
        tmp = arr[i];
        if (!tmpObj[tmp]) {
            tmpArr.push(tmp);
            tmpObj[tmp] = true;
        }
    }
    return tmpArr;
}
/**
 * formatter
 * @param  {Array} results The result of linter
 * @example
 * resultes = [{
        filePath: "/Users/eslint/project/myfile.js",
        messages: [{
            ruleId: "semi",
            severity: 2,
            message: "Missing semicolon.",
            line: 1,
            column: 13,
            nodeType: "ExpressionStatement",
            source: "\"use strict\"", // Deprecated: see "please note" paragraph below.
            fix: { range: [12, 12], text: ";" }
        }],
        errorCount: 1,
        warningCount: 0,
        fixableErrorCount: 1,
        fixableWarningCount: 0,
        source: "\"use strict\"\n"
    }]
* @return {String}         The result message
* @example
*    7:8  error  'b' is not defined.  no-undef

    8:2  error  'wlskd' is not defined.  no-undef

    2 problem  (2 errors, 0 warnings)
*/
function formatter(results) {
    if (!results) {
        throw new Error('Type Error: is an invalid results!');
    }
    var msg = '';
    results = results[0];

    var err = results.errorCount,
        warn = results.warningCount;

    var total = err + warn;
    var messages = results.messages;

    messages.forEach(function (msgItem) {
        var ruleId = msgItem.ruleId,
            line = msgItem.line,
            col = msgItem.column,
            desc = msgItem.message,
            severity = msgItem.severity;
        var type = severity == 1 ? 'warning'.yellow : 'error'.red; // error type

        // 7:8  error  'b' is not defined  no-undef
        msg += '\n  ' + line + ':' + col + '  ' + type + '  ' + desc + '  ' + ruleId + '\n';
    });

    // 1 problem (1 error, 0 warnings)
    var count = '\n  ' + total + ' problem  (' + err + ' errors, ' + warn + ' warnings)';
    msg += count.bold.yellow;
    return msg;
}
/**
 * Compile fis3-lint-rich-eslint
 * @param  {string} content     文件内容
 * @param  {File}   file        fis 的 File 对象 [fis3/lib/file.js]
 * @param  {object} settings    插件配置属性
 */
module.exports = function (content, file, conf) {

    var mixinDeep = require('mixin-deep');
    var defaultConfig = require('../package.json').eslintConfig;
    var CLIEngine = require("eslint").CLIEngine;

    var mixinConfig = defaultConfig;
    if(conf){
        mixinConfig = mixinDeep(defaultConfig, conf);
    }
    mixinConfig.globals = makeArrItemUnique(mixinConfig.globals);

    // 跳过忽略文件
    if (eslintIgnore(file, mixinConfig)) {
        return;
    }

    var cli = new CLIEngine(mixinConfig);

    var report = cli.executeOnText(content);
    if (report.errorCount || report.warningCount) {
        var msg = formatter(report.results);
        fis.log.info('%s  %s \n%s', file.id, 'eslint fail!'.red, msg);
        return;
    }

    fis.log.info(file.id, ' eslint pass!'.green);
}
