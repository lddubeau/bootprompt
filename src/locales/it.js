// bootshine.js locale configuration
// locale : Italian
// author : Mauro

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('it', {
        OK      : 'OK',
        CANCEL  : 'Annulla',
        CONFIRM : 'Conferma'
    });
}));