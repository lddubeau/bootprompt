// bootshine.js locale configuration
// locale : Croatian
// author : Mario Bašić

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('hr', {
        OK      : 'OK',
        CANCEL  : 'Odustani',
        CONFIRM : 'Potvrdi'
    });
}));