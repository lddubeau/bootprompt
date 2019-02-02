// bootshine.js locale configuration
// locale : Portuguese (Brasil)
// author : Nick Payne

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('pt-br', {
        OK      : 'OK',
        CANCEL  : 'Cancelar',
        CONFIRM : 'Sim'
    });
}));