// bootprompt.js locale configuration
// locale : Czech
// author : Lukáš Fryč

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('cs', {
        OK      : 'OK',
        CANCEL  : 'Zrušit',
        CONFIRM : 'Potvrdit'
    });
}));