// bootshine.js locale configuration
// locale : Basque
// author : Iker Ibarguren

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('eu', {
        OK      : 'OK',
        CANCEL  : 'Ezeztatu',
        CONFIRM : 'Onartu'
    });
}));