// bootprompt.js locale configuration
// locale : Hebrew
// author : Chen Alon

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('he', {
        OK      : 'אישור',
        CANCEL  : 'ביטול',
        CONFIRM : 'אישור'
    });
}));