// bootprompt.js locale configuration
// locale : Lithuanian
// author : Tomas

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('lt', {
        OK      : 'Gerai',
        CANCEL  : 'Atšaukti',
        CONFIRM : 'Patvirtinti'
    });
}));