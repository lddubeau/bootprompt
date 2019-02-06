// bootprompt.js locale configuration
// locale : Portuguese
// author : Cláudio Medina

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('pt', {
        OK      : 'OK',
        CANCEL  : 'Cancelar',
        CONFIRM : 'Confirmar'
    });
}));