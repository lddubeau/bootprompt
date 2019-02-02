// bootshine.js locale configuration
// locale : Thai
// author : Ishmael๛

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../bootshine'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../bootshine'));
    } else {
        factory(global.bootshine);
    }
}(this, function (bootshine) {
    bootshine.addLocale('th', {
        OK      : 'ตกลง',
        CANCEL  : 'ยกเลิก',
        CONFIRM : 'ยืนยัน'
    });
}));