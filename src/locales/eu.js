// bootprompt.js locale configuration
// locale : Basque
// author : Iker Ibarguren

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('eu', {
        OK      : 'OK',
        CANCEL  : 'Ezeztatu',
        CONFIRM : 'Onartu'
    });
}));