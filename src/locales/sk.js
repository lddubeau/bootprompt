// bootshine.js locale configuration
// locale : Slovak
// author : Stano Paška

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('sk', {
        OK      : 'OK',
        CANCEL  : 'Zrušiť',
        CONFIRM : 'Potvrdiť'
    });
}));