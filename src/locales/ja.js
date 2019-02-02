// bootshine.js locale configuration
// locale : Japanese
// author : ms183

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('ja', {
        OK      : 'OK',
        CANCEL  : 'キャンセル',
        CONFIRM : '確認'
    });
}));