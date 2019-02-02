// bootshine.js locale configuration
// locale : Dutch
// author : Bas ter Vrugt

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('nl', {
        OK      : 'OK',
        CANCEL  : 'Annuleren',
        CONFIRM : 'Accepteren'
    });
}));