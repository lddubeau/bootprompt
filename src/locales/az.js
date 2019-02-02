// bootshine.js locale configuration
// locale : Azerbaijani
// author : Valentin Belousov

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('az', {
        OK: 'OK',
        CANCEL: 'İmtina et',
        CONFIRM: 'Təsdiq et'
    });
}));