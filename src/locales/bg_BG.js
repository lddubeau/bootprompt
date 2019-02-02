// bootshine.js locale configuration
// locale : Bulgarian
// author :  mraiur

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('bg_BG', {
        OK      : 'Ок',
        CANCEL  : 'Отказ',
        CONFIRM : 'Потвърждавам'
    });
}));