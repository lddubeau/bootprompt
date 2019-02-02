// bootshine.js locale configuration
// locale : Ukrainian
// author : OlehBoiko

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('uk', {
        OK      : 'OK',
        CANCEL  : 'Відміна',
        CONFIRM : 'Прийняти'
    });
}));