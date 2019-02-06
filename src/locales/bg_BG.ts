// bootprompt.js locale configuration
// locale : Bulgarian
// author :  mraiur

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('bg_BG', {
        OK      : 'Ок',
        CANCEL  : 'Отказ',
        CONFIRM : 'Потвърждавам'
    });
}));