// bootprompt.js locale configuration
// locale : Arabic
// author : Emad Omar

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('ar', {
        OK: 'موافق',
        CANCEL: 'الغاء',
        CONFIRM: 'تأكيد'
    });
}));
