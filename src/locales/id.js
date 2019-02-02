// bootshine.js locale configuration
// locale : Indonesian
// author : Budi Irawan

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('id', {
        OK      : 'OK',
        CANCEL  : 'Batal',
        CONFIRM : 'OK'
    });
}));