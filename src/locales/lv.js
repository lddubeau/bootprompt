// bootshine.js locale configuration
// locale : Latvian
// author : Dmitry Bogatykh, Lauris BH

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('lv', {
        OK      : 'Labi',
        CANCEL  : 'Atcelt',
        CONFIRM : 'Apstiprināt'
    });
}));