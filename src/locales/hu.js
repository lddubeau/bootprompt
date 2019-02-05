// bootprompt.js locale configuration
// locale : Hungarian
// author : Márk Sági-Kazár

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('hu', {
        OK      : 'OK',
        CANCEL  : 'Mégsem',
        CONFIRM : 'Megerősít'
    });
}));