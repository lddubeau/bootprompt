// bootprompt.js locale configuration
// locale : Indonesian
// author : Budi Irawan

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('id', {
        OK      : 'OK',
        CANCEL  : 'Batal',
        CONFIRM : 'OK'
    });
}));