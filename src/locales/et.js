// bootshine.js locale configuration
// locale : Estonian
// author : Pavel Krõlov

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('et', {
        OK      : 'OK',
        CANCEL  : 'Katkesta',
        CONFIRM : 'OK'
    });
}));