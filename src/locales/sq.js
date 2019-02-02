// bootshine.js locale configuration
// locale : Albanian
// author : Knut Hühne

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('sq', {
        OK : 'OK',
        CANCEL : 'Anulo',
        CONFIRM : 'Prano'
    });
}));