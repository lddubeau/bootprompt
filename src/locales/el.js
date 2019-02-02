// bootshine.js locale configuration
// locale : Greek
// author : Tolis Emmanouilidis

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('el', {
        OK      : 'Εντάξει',
        CANCEL  : 'Ακύρωση',
        CONFIRM : 'Επιβεβαίωση'
    });
}));