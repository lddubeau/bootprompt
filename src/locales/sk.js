// bootprompt.js locale configuration
// locale : Slovak
// author : Stano Paška

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('sk', {
        OK      : 'OK',
        CANCEL  : 'Zrušiť',
        CONFIRM : 'Potvrdiť'
    });
}));