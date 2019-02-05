// bootprompt.js locale configuration
// locale : Dutch
// author : Bas ter Vrugt

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('nl', {
        OK      : 'OK',
        CANCEL  : 'Annuleren',
        CONFIRM : 'Accepteren'
    });
}));