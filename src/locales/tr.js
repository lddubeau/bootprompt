// bootshine.js locale configuration
// locale : Turkish
// author : Enes Karaca

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('tr', {
        OK      : 'Tamam',
        CANCEL  : 'İptal',
        CONFIRM : 'Onayla'
    });
}));