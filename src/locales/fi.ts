// bootprompt.js locale configuration
// locale : Finnish
// author : Nick Payne

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('fi', {
        OK      : 'OK',
        CANCEL  : 'Peruuta',
        CONFIRM : 'OK'
    });
}));