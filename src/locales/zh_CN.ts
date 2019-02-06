// bootprompt.js locale configuration
// locale : Chinese (China / People's Republic of China)
// author : Nick Payne

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('zh_CN', {
        OK      : 'OK',
        CANCEL  : '取消',
        CONFIRM : '确认'
    });
}));