// bootshine.js locale configuration
// locale : Spanish
// author : Ian Leckey

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('es', {
        OK      : 'OK',
        CANCEL  : 'Cancelar',
        CONFIRM : 'Aceptar'
    });
}));