/**
 * @fileoverview Used for creating a rich configuration based on eslint and eslint-recommended.
 * @author ice.tang
 */

'use strict';

function eslintIgnore(file, conf) {
    var ignored = [];
    var len = 0;
    var ignoreFiles;

    if (conf.ignoreFiles) {
        ignoreFiles = conf.ignoreFiles;
        if (ignoreFiles.constructor === String || ignoreFiles.constructor === RegExp) {
            ignored = [ignoreFiles];
        } else if (ignoreFiles.constructor === Array) {
            ignored = ignoreFiles;
        }
        // delete custom eslintConfig property
        delete conf.ignoreFiles;
    }
    len = ignored.length;
    if (len) {
        for (let i = 0; i < len; i++) {
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
    for (let i = 0, len = arr.length; i < len; i++) {
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
 * results = [{
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
    var msgText = '';
    var _results;
    var errCount;
    var warnCount;
    var totalCount;
    var messages;
    var lineMsgText;
    var firstIndex = 0;
    var warningSeverityNum = 1;

    if (!results) {
        throw new Error('Type Error: is an invalid results!');
    }
    _results = results[firstIndex];

    errCount = _results.errorCount;
    warnCount = _results.warningCount;

    totalCount = errCount + warnCount;
    messages = _results.messages;

    messages.forEach(function(msgItem) {
        var ruleId = msgItem.ruleId,
            line = msgItem.line,
            col = msgItem.column,
            desc = msgItem.message,
            severity = msgItem.severity;
        var type = severity === warningSeverityNum ? 'warning'.yellow : 'error'.red; // error type

        // 7:8  error  'b' is not defined  no-undef
        msgText += '\n  ' + line + ':' + col + '  ' + type + '  ' + desc + '  ' + ruleId + '\n';
    });

    // 1 problem (1 error, 0 warnings)
    lineMsgText = '\n  ' + totalCount + ' problem  (' + errCount + ' errors, ' + warnCount + ' warnings)';
    msgText += lineMsgText.bold.yellow;
    return msgText;
}
/**
 * Compile fis3-lint-rich-eslint
 * @param  {string} content     文件内容
 * @param  {File}   file        fis 的 File 对象 [fis3/lib/file.js]
 * @param  {object} settings    插件配置属性
 */
module.exports = function(content, file, conf) {

    var path = require('path');
    var mixinDeep = require('mixin-deep');
    var defaultConfig = require('../package.json').eslintConfigs;
    var CLIEngine = require("eslint").CLIEngine;
    var mixinConfig = defaultConfig;
    var cli;
    var report;
    var msg;
    // 推荐规则
    var recommendedFilePath = path.join(__dirname, '../node_modules/eslint/conf/eslint-recommended.js');

    mixinConfig.configFile = recommendedFilePath;

    
    if (conf) {
        mixinConfig = mixinDeep(defaultConfig, conf);
    }
    mixinConfig.globals = makeArrItemUnique(mixinConfig.globals);

    // 跳过忽略文件
    if (eslintIgnore(file, mixinConfig)) {
        return;
    }

    cli = new CLIEngine(mixinConfig);

    report = cli.executeOnText(content);
    if (report.errorCount || report.warningCount) {
        msg = formatter(report.results);
        fis.log.info('%s  %s \n%s', file.id, 'eslint fail!'.red, msg);
        return;
    }

    fis.log.info(file.id, ' eslint pass!'.green);
};
