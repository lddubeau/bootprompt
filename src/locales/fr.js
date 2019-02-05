// bootprompt.js locale configuration
// locale : French
// author : Nick Payne, Sebastien Andary

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('fr', {
        OK      : 'OK',
        CANCEL  : 'Annuler',
        CONFIRM : 'Confirmer'
    });
}));