// bootprompt.js locale configuration
// locale : Turkish
// author : Enes Karaca

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('tr', {
        OK      : 'Tamam',
        CANCEL  : 'İptal',
        CONFIRM : 'Onayla'
    });
}));