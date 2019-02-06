// bootprompt.js locale configuration
// locale : Norwegian
// author : Nils Magnus Englund

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('no', {
        OK      : 'OK',
        CANCEL  : 'Avbryt',
        CONFIRM : 'OK'
    });
}));