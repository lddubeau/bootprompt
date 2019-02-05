// bootprompt.js locale configuration
// locale : Slovenian
// author : @metalcamp

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('sl', {
        OK : 'OK',
        CANCEL : 'Prekliči',
        CONFIRM : 'Potrdi'
    });
}));