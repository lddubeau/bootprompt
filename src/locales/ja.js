// bootprompt.js locale configuration
// locale : Japanese
// author : ms183

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('ja', {
        OK      : 'OK',
        CANCEL  : 'キャンセル',
        CONFIRM : '確認'
    });
}));