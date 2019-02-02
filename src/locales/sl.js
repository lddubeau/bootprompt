// bootshine.js locale configuration
// locale : Slovenian
// author : @metalcamp

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('sl', {
        OK : 'OK',
        CANCEL : 'Prekliči',
        CONFIRM : 'Potrdi'
    });
}));