// bootprompt.js locale configuration
// locale : Azerbaijani
// author : Valentin Belousov

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('az', {
        OK: 'OK',
        CANCEL: 'İmtina et',
        CONFIRM: 'Təsdiq et'
    });
}));