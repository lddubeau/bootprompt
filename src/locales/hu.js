// bootshine.js locale configuration
// locale : Hungarian
// author : Márk Sági-Kazár

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('hu', {
        OK      : 'OK',
        CANCEL  : 'Mégsem',
        CONFIRM : 'Megerősít'
    });
}));