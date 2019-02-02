// bootshine.js locale configuration
// locale : French
// author : Nick Payne, Sebastien Andary

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('fr', {
        OK      : 'OK',
        CANCEL  : 'Annuler',
        CONFIRM : 'Confirmer'
    });
}));