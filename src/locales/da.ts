// bootprompt.js locale configuration
// locale : Danish
// author : Frederik Alkærsig

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('da', {
        OK      : 'OK',
        CANCEL  : 'Annuller',
        CONFIRM : 'Accepter'
    });
}));