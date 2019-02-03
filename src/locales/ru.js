// bootshine.js locale configuration
// locale : Russian
// author : ionian-wind

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('ru', {
        OK      : 'OK',
        CANCEL  : 'Отмена',
        CONFIRM : 'Подтвердить'
    });
}));
