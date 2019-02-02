(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['bootshine'], factory);
  } else if (typeof module === 'object' && module.exports) {
    factory(require('./bootshine'));
  } else {
    factory(global.bootshine);
  }
}(this, function (bootshine) {

  (function () {
    bootshine.addLocale('ar', {
      OK: 'موافق',
      CANCEL: 'الغاء',
      CONFIRM: 'تأكيد'
    });
  })();

  (function () {
    bootshine.addLocale('az', {
      OK: 'OK',
      CANCEL: 'İmtina et',
      CONFIRM: 'Təsdiq et'
    });
  })();

  (function () {
    bootshine.addLocale('bg_BG', {
      OK: 'Ок',
      CANCEL: 'Отказ',
      CONFIRM: 'Потвърждавам'
    });
  })();

  (function () {
    bootshine.addLocale('br', {
      OK: 'OK',
      CANCEL: 'Cancelar',
      CONFIRM: 'Sim'
    });
  })();

  (function () {
    bootshine.addLocale('cs', {
      OK: 'OK',
      CANCEL: 'Zrušit',
      CONFIRM: 'Potvrdit'
    });
  })();

  (function () {
    bootshine.addLocale('da', {
      OK: 'OK',
      CANCEL: 'Annuller',
      CONFIRM: 'Accepter'
    });
  })();

  (function () {
    bootshine.addLocale('de', {
      OK: 'OK',
      CANCEL: 'Abbrechen',
      CONFIRM: 'Akzeptieren'
    });
  })();

  (function () {
    bootshine.addLocale('el', {
      OK: 'Εντάξει',
      CANCEL: 'Ακύρωση',
      CONFIRM: 'Επιβεβαίωση'
    });
  })();

  (function () {
    bootshine.addLocale('en', {
      OK: 'OK',
      CANCEL: 'Cancel',
      CONFIRM: 'OK'
    });
  })();

  (function () {
    bootshine.addLocale('es', {
      OK: 'OK',
      CANCEL: 'Cancelar',
      CONFIRM: 'Aceptar'
    });
  })();

  (function () {
    bootshine.addLocale('eu', {
      OK: 'OK',
      CANCEL: 'Ezeztatu',
      CONFIRM: 'Onartu'
    });
  })();

  (function () {
    bootshine.addLocale('et', {
      OK: 'OK',
      CANCEL: 'Katkesta',
      CONFIRM: 'OK'
    });
  })();

  (function () {
    bootshine.addLocale('fa', {
      OK: 'قبول',
      CANCEL: 'لغو',
      CONFIRM: 'تایید'
    });
  })();

  (function () {
    bootshine.addLocale('fi', {
      OK: 'OK',
      CANCEL: 'Peruuta',
      CONFIRM: 'OK'
    });
  })();

  (function () {
    bootshine.addLocale('fr', {
      OK: 'OK',
      CANCEL: 'Annuler',
      CONFIRM: 'Confirmer'
    });
  })();

  (function () {
    bootshine.addLocale('he', {
      OK: 'אישור',
      CANCEL: 'ביטול',
      CONFIRM: 'אישור'
    });
  })();

  (function () {
    bootshine.addLocale('hu', {
      OK: 'OK',
      CANCEL: 'Mégsem',
      CONFIRM: 'Megerősít'
    });
  })();

  (function () {
    bootshine.addLocale('hr', {
      OK: 'OK',
      CANCEL: 'Odustani',
      CONFIRM: 'Potvrdi'
    });
  })();

  (function () {
    bootshine.addLocale('id', {
      OK: 'OK',
      CANCEL: 'Batal',
      CONFIRM: 'OK'
    });
  })();

  (function () {
    bootshine.addLocale('it', {
      OK: 'OK',
      CANCEL: 'Annulla',
      CONFIRM: 'Conferma'
    });
  })();

  (function () {
    bootshine.addLocale('ja', {
      OK: 'OK',
      CANCEL: 'キャンセル',
      CONFIRM: '確認'
    });
  })();

  (function () {
    bootshine.addLocale('ko', {
      OK: 'OK',
      CANCEL: '취소',
      CONFIRM: '확인'
    });
  })();

  (function () {
    bootshine.addLocale('lt', {
      OK: 'Gerai',
      CANCEL: 'Atšaukti',
      CONFIRM: 'Patvirtinti'
    });
  })();

  (function () {
    bootshine.addLocale('lv', {
      OK: 'Labi',
      CANCEL: 'Atcelt',
      CONFIRM: 'Apstiprināt'
    });
  })();

  (function () {
    bootshine.addLocale('nl', {
      OK: 'OK',
      CANCEL: 'Annuleren',
      CONFIRM: 'Accepteren'
    });
  })();

  (function () {
    bootshine.addLocale('no', {
      OK: 'OK',
      CANCEL: 'Avbryt',
      CONFIRM: 'OK'
    });
  })();

  (function () {
    bootshine.addLocale('pl', {
      OK: 'OK',
      CANCEL: 'Anuluj',
      CONFIRM: 'Potwierdź'
    });
  })();

  (function () {
    bootshine.addLocale('pt', {
      OK: 'OK',
      CANCEL: 'Cancelar',
      CONFIRM: 'Confirmar'
    });
  })();

  (function () {
    bootshine.addLocale('ru', {
      OK: 'OK',
      CANCEL: 'Отмена',
      CONFIRM: 'Применить'
    });
  })();

  (function () {
    bootshine.addLocale('sk', {
      OK: 'OK',
      CANCEL: 'Zrušiť',
      CONFIRM: 'Potvrdiť'
    });
  })();

  (function () {
    bootshine.addLocale('sl', {
      OK: 'OK',
      CANCEL: 'Prekliči',
      CONFIRM: 'Potrdi'
    });
  })();

  (function () {
    bootshine.addLocale('sq', {
      OK: 'OK',
      CANCEL: 'Anulo',
      CONFIRM: 'Prano'
    });
  })();

  (function () {
    bootshine.addLocale('sv', {
      OK: 'OK',
      CANCEL: 'Avbryt',
      CONFIRM: 'OK'
    });
  })();

  (function () {
    bootshine.addLocale('th', {
      OK: 'ตกลง',
      CANCEL: 'ยกเลิก',
      CONFIRM: 'ยืนยัน'
    });
  })();

  (function () {
    bootshine.addLocale('tr', {
      OK: 'Tamam',
      CANCEL: 'İptal',
      CONFIRM: 'Onayla'
    });
  })();

  (function () {
    bootshine.addLocale('uk', {
      OK: 'OK',
      CANCEL: 'Відміна',
      CONFIRM: 'Прийняти'
    });
  })();

  (function () {
    bootshine.addLocale('zh_CN', {
      OK: 'OK',
      CANCEL: '取消',
      CONFIRM: '确认'
    });
  })();

  (function () {
    bootshine.addLocale('zh_TW', {
      OK: 'OK',
      CANCEL: '取消',
      CONFIRM: '確認'
    });
  })();
}));
