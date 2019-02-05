// bootprompt.js locale configuration
// locale : Albanian
// author : Knut Hühne

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('sq', {
        OK : 'OK',
        CANCEL : 'Anulo',
        CONFIRM : 'Prano'
    });
}));