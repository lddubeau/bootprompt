// bootprompt.js locale configuration
// locale : Swedish
// author : Mattias Reichel

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('sv', {
        OK      : 'OK',
        CANCEL  : 'Avbryt',
        CONFIRM : 'OK'
    });
}));