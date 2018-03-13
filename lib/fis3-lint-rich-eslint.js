/**
 * @fileoverview Used for creating a rich configuration based on eslint and eslint-recommended.
 * @author ice.tang
 */

'use strict';
const path = require('path');
const fs = require('fs');
const mixinDeep = require('mixin-deep');
const lagouConfig = require('eslint-config-lagou');
const CLIEngine = require('eslint').CLIEngine;
// 推荐规则
const recommendedFilePath = path.resolve(require.resolve('eslint'), "../../conf/eslint-recommended.js");
const firstIndex = 0;

/**
 * mkdirSync 同步创建多级目录
 * @param {string} dirname 需要创建的目录
 */
function mkdirSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
/**
 * eslintIgnore 设置忽略文件或目录
 * @param {object} file 
 * @param {string} conf 
 */
function eslintIgnore(file, conf) {
    let ignored = conf.ignoreFiles;

    delete conf.ignoreFiles; // delete custom configuration property

    for (let i = 0, len = ignored.length; i < len; i++) {
        if (fis.util.filter(file.subpath, ignored[i])) {
            return true;
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
    let tmpArr = [];
    let tmpObj = {};
    let tmp;
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
        filePath: '/Users/eslint/project/myfile.js',
        messages: [{
            ruleId: 'semi',
            severity: 2,
            message: 'Missing semicolon.',
            line: 1,
            column: 13,
            nodeType: 'ExpressionStatement',
            source: '\'use strict\', // Deprecated: see 'please note' paragraph below.
            fix: { range: [12, 12], text: ';' }
        }],
        errorCount: 1,
        warningCount: 0,
        fixableErrorCount: 1,
        fixableWarningCount: 0,
        source: '\'use strict\'\n'
    }]
* @return {Object}         The result message and count
* @example
*    7:8  error  'b' is not defined.  no-undef

    8:2  error  'wlskd' is not defined.  no-undef

    2 problem  (2 errors, 0 warnings)
*/
function formatter(results) {
    let msgText = '';
    let _results;
    let errCount;
    let warnCount;
    let totalCount;
    let messages;
    let lineMsgText;
    let warningSeverityNum = 1;

    if (!results) {
        throw new Error('Type Error: is an invalid results!');
    }
    _results = results[firstIndex];

    errCount = _results.errorCount;
    warnCount = _results.warningCount;

    totalCount = errCount + warnCount;
    messages = _results.messages;

    messages.forEach(function (msgItem) {
        let ruleId = msgItem.ruleId;
        let line = msgItem.line;
        let col = msgItem.column;
        let desc = msgItem.message;
        let severity = msgItem.severity;
        let type = severity === warningSeverityNum ? 'warning'.yellow : 'error'.red; // error type

        // 7:8  error  'b' is not defined  no-undef
        msgText += '\n  ' + line + ':' + col + '  ' + type + '  ' + desc + '  ' + ruleId + '\n';
    });

    // 1 problem (1 error, 0 warnings)
    lineMsgText = '\n  ' + totalCount + ' problem  (' + errCount + ' errors, ' + warnCount + ' warnings)';
    msgText += lineMsgText.bold.yellow;
    return {
        msgText,
        errCount,
        totalCount
    };
}

/**
 * formatAllowOutfixed 格式化输出配置
 * @param {Object} config 
 */
function formatAllowOutfixed(config) {
    const resourceOutputConfig = config.allowOutfixed;
    const firstIndex = 0;
    const type = Object.prototype.toString.call(resourceOutputConfig);
    let outputConfig = {};
    if (type === '[object Boolean]') {
        outputConfig.allow = resourceOutputConfig;
    } else if (type === '[object Array]') {
        outputConfig.allow = resourceOutputConfig[firstIndex];
        if (resourceOutputConfig.length > 1) {
            outputConfig = mixinDeep({}, outputConfig, resourceOutputConfig[1]);
        }
    }
    return outputConfig;
}

/**
 * Compile fis3-lint-rich-eslint
 * @param  {string} content     文件内容
 * @param  {File}   file        fis 的 File 对象 [fis3/lib/file.js]
 * @param  {object} settings    插件配置属性
 */
module.exports = function (content, file, conf) {
    let mixinConfig = {
        fix: false,
        allowOutfixed: false,
        envs: [
            'browser',
            'es6',
            'worker',
            'amd',
            'jquery'
        ],
        globals: [
            'module',
            'exports',
            '__inline',
            '__uri',
            '__RESOURCE_MAP__',
            'fis'
        ],
        ignoreFiles: [
            'bower_components/**',
            'node_modules/**',
            'lint-fixed/**',
            'js-conf.js'
        ],
        useEslintrc: false,
        rules: lagouConfig.rules
    };

    if (conf) {
        mixinConfig = mixinDeep(mixinConfig, conf);
    }

    mixinConfig.configFile = recommendedFilePath;
    mixinConfig.globals = makeArrItemUnique(mixinConfig.globals);
    mixinConfig.ignoreFiles = makeArrItemUnique(mixinConfig.ignoreFiles);

    // 忽略原生提供的ignorePattern功能，改用ignoreFiles
    delete mixinConfig.ignorePattern;

    // 跳过忽略文件
    if (eslintIgnore(file, mixinConfig)) {
        return;
    }

    let cli = new CLIEngine(mixinConfig);

    let report = cli.executeOnText(content);
    let fixedText = report.results[firstIndex].output;
    let outputConfig = formatAllowOutfixed(mixinConfig);

    // 输出修复过的文档
    if (mixinConfig.fix && outputConfig.allow && fixedText) {
        // 修改源文件。警告：此操作会修改源文件，是否会出错不敢保证，所以慎用！！！
        if (outputConfig.root) {
            let ws = fs.createWriteStream(file.realpath, {
                autoClose: true
            });
            ws.write(fixedText);
            // 输出到指定目录
        } else {
            let relativeDirname = outputConfig.dirname || '/lint-fixed';
            let dirname = path.join(process.cwd(), relativeDirname, file.subdirname);
            // 创建或检测是否存在文件所在目录
            let hadMkdirSync = mkdirSync(dirname);
            if (hadMkdirSync) {
                let ws = fs.createWriteStream(path.join(dirname, '/', file.basename), {
                    autoClose: true
                });
                ws.write(fixedText);
            }
        }
    }

    if (report.errorCount || report.warningCount) {
        let result = formatter(report.results);
        fis.log.warn('%s \n%s', file.id, result.msgText);
        if (result.errCount > 0) {
            process.exit();
        }
        return;
    }

    fis.log.info(file.id, ' eslint pass!'.green);
};
