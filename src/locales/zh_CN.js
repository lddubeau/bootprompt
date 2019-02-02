// bootshine.js locale configuration
// locale : Chinese (China / People's Republic of China)
// author : Nick Payne

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('zh_CN', {
        OK      : 'OK',
        CANCEL  : '取消',
        CONFIRM : '确认'
    });
}));