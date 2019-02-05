// bootprompt.js locale configuration
// locale : Russian
// author : ionian-wind

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('ru', {
        OK      : 'OK',
        CANCEL  : 'Отмена',
        CONFIRM : 'Подтвердить'
    });
}));
