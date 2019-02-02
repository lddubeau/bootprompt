// bootshine.js locale configuration
// locale : Czech
// author : Lukáš Fryč

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('cs', {
        OK      : 'OK',
        CANCEL  : 'Zrušit',
        CONFIRM : 'Potvrdit'
    });
}));