// bootshine.js locale configuration
// locale : Korean
// author : rigning

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('ko', {
        OK: 'OK',
        CANCEL: '취소',
        CONFIRM: '확인'
    });
}));