// bootprompt.js locale configuration
// locale : Ukrainian
// author : OlehBoiko

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('uk', {
        OK      : 'OK',
        CANCEL  : 'Відміна',
        CONFIRM : 'Прийняти'
    });
}));