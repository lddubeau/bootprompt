// bootprompt.js locale configuration
// locale : Latvian
// author : Dmitry Bogatykh, Lauris BH

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('lv', {
        OK      : 'Labi',
        CANCEL  : 'Atcelt',
        CONFIRM : 'Apstiprināt'
    });
}));