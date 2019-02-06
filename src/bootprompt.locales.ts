(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['bootprompt'], factory);
  } else if (typeof module === 'object' && module.exports) {
    factory(require('./bootprompt'));
  } else {
    factory(global.bootprompt);
  }
}(this, function (bootprompt) {

  (function () {
    bootprompt.addLocale('ar', {
      OK: 'موافق',
      CANCEL: 'الغاء',
      CONFIRM: 'تأكيد'
    });
  })();

  (function () {
    bootprompt.addLocale('az', {
      OK: 'OK',
      CANCEL: 'İmtina et',
      CONFIRM: 'Təsdiq et'
    });
  })();

  (function () {
    bootprompt.addLocale('bg_BG', {
      OK: 'Ок',
      CANCEL: 'Отказ',
      CONFIRM: 'Потвърждавам'
    });
  })();

  (function () {
    bootprompt.addLocale('br', {
      OK: 'OK',
      CANCEL: 'Cancelar',
      CONFIRM: 'Sim'
    });
  })();

  (function () {
    bootprompt.addLocale('cs', {
      OK: 'OK',
      CANCEL: 'Zrušit',
      CONFIRM: 'Potvrdit'
    });
  })();

  (function () {
    bootprompt.addLocale('da', {
      OK: 'OK',
      CANCEL: 'Annuller',
      CONFIRM: 'Accepter'
    });
  })();

  (function () {
    bootprompt.addLocale('de', {
      OK: 'OK',
      CANCEL: 'Abbrechen',
      CONFIRM: 'Akzeptieren'
    });
  })();

  (function () {
    bootprompt.addLocale('el', {
      OK: 'Εντάξει',
      CANCEL: 'Ακύρωση',
      CONFIRM: 'Επιβεβαίωση'
    });
  })();

  (function () {
    bootprompt.addLocale('en', {
      OK: 'OK',
      CANCEL: 'Cancel',
      CONFIRM: 'OK'
    });
  })();

  (function () {
    bootprompt.addLocale('es', {
      OK: 'OK',
      CANCEL: 'Cancelar',
      CONFIRM: 'Aceptar'
    });
  })();

  (function () {
    bootprompt.addLocale('eu', {
      OK: 'OK',
      CANCEL: 'Ezeztatu',
      CONFIRM: 'Onartu'
    });
  })();

  (function () {
    bootprompt.addLocale('et', {
      OK: 'OK',
      CANCEL: 'Katkesta',
      CONFIRM: 'OK'
    });
  })();

  (function () {
    bootprompt.addLocale('fa', {
      OK: 'قبول',
      CANCEL: 'لغو',
      CONFIRM: 'تایید'
    });
  })();

  (function () {
    bootprompt.addLocale('fi', {
      OK: 'OK',
      CANCEL: 'Peruuta',
      CONFIRM: 'OK'
    });
  })();

  (function () {
    bootprompt.addLocale('fr', {
      OK: 'OK',
      CANCEL: 'Annuler',
      CONFIRM: 'Confirmer'
    });
  })();

  (function () {
    bootprompt.addLocale('he', {
      OK: 'אישור',
      CANCEL: 'ביטול',
      CONFIRM: 'אישור'
    });
  })();

  (function () {
    bootprompt.addLocale('hu', {
      OK: 'OK',
      CANCEL: 'Mégsem',
      CONFIRM: 'Megerősít'
    });
  })();

  (function () {
    bootprompt.addLocale('hr', {
      OK: 'OK',
      CANCEL: 'Odustani',
      CONFIRM: 'Potvrdi'
    });
  })();

  (function () {
    bootprompt.addLocale('id', {
      OK: 'OK',
      CANCEL: 'Batal',
      CONFIRM: 'OK'
    });
  })();

  (function () {
    bootprompt.addLocale('it', {
      OK: 'OK',
      CANCEL: 'Annulla',
      CONFIRM: 'Conferma'
    });
  })();

  (function () {
    bootprompt.addLocale('ja', {
      OK: 'OK',
      CANCEL: 'キャンセル',
      CONFIRM: '確認'
    });
  })();

  (function () {
    bootprompt.addLocale('ko', {
      OK: 'OK',
      CANCEL: '취소',
      CONFIRM: '확인'
    });
  })();

  (function () {
    bootprompt.addLocale('lt', {
      OK: 'Gerai',
      CANCEL: 'Atšaukti',
      CONFIRM: 'Patvirtinti'
    });
  })();

  (function () {
    bootprompt.addLocale('lv', {
      OK: 'Labi',
      CANCEL: 'Atcelt',
      CONFIRM: 'Apstiprināt'
    });
  })();

  (function () {
    bootprompt.addLocale('nl', {
      OK: 'OK',
      CANCEL: 'Annuleren',
      CONFIRM: 'Accepteren'
    });
  })();

  (function () {
    bootprompt.addLocale('no', {
      OK: 'OK',
      CANCEL: 'Avbryt',
      CONFIRM: 'OK'
    });
  })();

  (function () {
    bootprompt.addLocale('pl', {
      OK: 'OK',
      CANCEL: 'Anuluj',
      CONFIRM: 'Potwierdź'
    });
  })();

  (function () {
    bootprompt.addLocale('pt', {
      OK: 'OK',
      CANCEL: 'Cancelar',
      CONFIRM: 'Confirmar'
    });
  })();

  (function () {
    bootprompt.addLocale('ru', {
      OK: 'OK',
      CANCEL: 'Отмена',
      CONFIRM: 'Подтвердить'
    });
  })();

  (function () {
    bootprompt.addLocale('sk', {
      OK: 'OK',
      CANCEL: 'Zrušiť',
      CONFIRM: 'Potvrdiť'
    });
  })();

  (function () {
    bootprompt.addLocale('sl', {
      OK: 'OK',
      CANCEL: 'Prekliči',
      CONFIRM: 'Potrdi'
    });
  })();

  (function () {
    bootprompt.addLocale('sq', {
      OK: 'OK',
      CANCEL: 'Anulo',
      CONFIRM: 'Prano'
    });
  })();

  (function () {
    bootprompt.addLocale('sv', {
      OK: 'OK',
      CANCEL: 'Avbryt',
      CONFIRM: 'OK'
    });
  })();

  (function () {
    bootprompt.addLocale('th', {
      OK: 'ตกลง',
      CANCEL: 'ยกเลิก',
      CONFIRM: 'ยืนยัน'
    });
  })();

  (function () {
    bootprompt.addLocale('tr', {
      OK: 'Tamam',
      CANCEL: 'İptal',
      CONFIRM: 'Onayla'
    });
  })();

  (function () {
    bootprompt.addLocale('uk', {
      OK: 'OK',
      CANCEL: 'Відміна',
      CONFIRM: 'Прийняти'
    });
  })();

  (function () {
    bootprompt.addLocale('zh_CN', {
      OK: 'OK',
      CANCEL: '取消',
      CONFIRM: '确认'
    });
  })();

  (function () {
    bootprompt.addLocale('zh_TW', {
      OK: 'OK',
      CANCEL: '取消',
      CONFIRM: '確認'
    });
  })();
}));
