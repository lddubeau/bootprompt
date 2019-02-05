// bootprompt.js locale configuration
// locale : Portuguese (Brasil)
// author : Nick Payne

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('pt-br', {
        OK      : 'OK',
        CANCEL  : 'Cancelar',
        CONFIRM : 'Sim'
    });
}));