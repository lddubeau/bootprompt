// bootshine.js locale configuration
// locale : Norwegian
// author : Nils Magnus Englund

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('no', {
        OK      : 'OK',
        CANCEL  : 'Avbryt',
        CONFIRM : 'OK'
    });
}));