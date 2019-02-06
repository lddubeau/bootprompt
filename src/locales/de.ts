// bootprompt.js locale configuration
// locale : German
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
    bootprompt.addLocale('de', {
        OK      : 'OK',
        CANCEL  : 'Abbrechen',
        CONFIRM : 'Akzeptieren'
    });
}));