// bootshine.js locale configuration
// locale : Lithuanian
// author : Tomas

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('lt', {
        OK      : 'Gerai',
        CANCEL  : 'Atšaukti',
        CONFIRM : 'Patvirtinti'
    });
}));