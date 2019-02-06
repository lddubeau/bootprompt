// bootprompt.js locale configuration
// locale : Korean
// author : rigning

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('ko', {
        OK: 'OK',
        CANCEL: '취소',
        CONFIRM: '확인'
    });
}));