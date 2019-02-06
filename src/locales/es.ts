// bootprompt.js locale configuration
// locale : Spanish
// author : Ian Leckey

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('es', {
        OK      : 'OK',
        CANCEL  : 'Cancelar',
        CONFIRM : 'Aceptar'
    });
}));