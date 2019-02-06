// bootprompt.js locale configuration
// locale : Croatian
// author : Mario Bašić

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('hr', {
        OK      : 'OK',
        CANCEL  : 'Odustani',
        CONFIRM : 'Potvrdi'
    });
}));