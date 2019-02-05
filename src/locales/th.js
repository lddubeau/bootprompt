// bootprompt.js locale configuration
// locale : Thai
// author : Ishmael๛

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootprompt'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootprompt'));
    } else {
        factory(global.bootprompt);
    }
}(this, function (bootprompt) {
    bootprompt.addLocale('th', {
        OK      : 'ตกลง',
        CANCEL  : 'ยกเลิก',
        CONFIRM : 'ยืนยัน'
    });
}));