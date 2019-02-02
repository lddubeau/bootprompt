// bootshine.js locale configuration
// locale : Arabic
// author : Emad Omar

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('ar', {
        OK: 'موافق',
        CANCEL: 'الغاء',
        CONFIRM: 'تأكيد'
    });
}));
