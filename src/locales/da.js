// bootshine.js locale configuration
// locale : Danish
// author : Frederik Alkærsig

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('da', {
        OK      : 'OK',
        CANCEL  : 'Annuller',
        CONFIRM : 'Accepter'
    });
}));