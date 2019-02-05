// bootprompt.js locale configuration
// locale : Polish
// author : Szczepan Cieślik

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('pl', {
        OK      : 'OK',
        CANCEL  : 'Anuluj',
        CONFIRM : 'Potwierdź'
    });
}));