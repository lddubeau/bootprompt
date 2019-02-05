describe("bootprompt locales", function() {
  var labels;
  function setLocale(locale) {
    var d1, d2;
    bootprompt.setLocale(locale);
    d1 = bootprompt.alert("foo");
    d2 = bootprompt.confirm("foo", function() {
      return true;
    });

    labels = {
      ok: d1.find(".btn:first").text(),
      cancel: d2.find(".btn:first").text(),
      confirm: d2.find(".btn:last").text()
    };
  }

  describe("Invalid locale", function() {
    beforeEach(function() {
      setLocale("xx");
    });

    it("shows the default OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the default CANCEL translation", function() {
      expect(labels.cancel).to.equal("Cancel");
    });

    it("shows the default CONFIRM translation", function() {
      expect(labels.confirm).to.equal("OK");
    });
  });

  describe("Arabic", function() {
    beforeEach(function() {
      setLocale("ar");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("موافق");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("الغاء");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("تأكيد");
    });
  });

  describe("Azerbaijani", function() {
    beforeEach(function() {
      setLocale("az");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal('OK');
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal('İmtina et');
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal('Təsdiq et');
    });
  });

  describe("English", function() {
    beforeEach(function() {
      setLocale("en");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Cancel");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("OK");
    });
  });

  describe("French", function() {
    beforeEach(function() {
      setLocale("fr");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Annuler");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Confirmer");
    });
  });

  describe("German", function() {
    beforeEach(function() {
      setLocale("de");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Abbrechen");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Akzeptieren");
    });
  });

  describe("Spanish", function() {
    beforeEach(function() {
      setLocale("es");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Cancelar");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Aceptar");
    });
  });

  describe("Basque", function() {
    beforeEach(function() {
      setLocale("eu");
    });
    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });
    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Ezeztatu");
    });
    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Onartu");
    });
  });

  describe("Portuguese", function() {
    beforeEach(function() {
      setLocale("br");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Cancelar");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Sim");
    });
  });

  describe("Dutch", function() {
    beforeEach(function() {
      setLocale("nl");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Annuleren");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Accepteren");
    });
  });

  describe("Russian", function() {
    beforeEach(function() {
      setLocale("ru");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Отмена");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Подтвердить");
    });
  });

  describe("Indonesian", function() {
    beforeEach(function() {
      setLocale("id");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Batal");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("OK");
    });
  });


  describe("Italian", function() {
    beforeEach(function() {
      setLocale("it");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Annulla");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Conferma");
    });
  });

  describe("Polish", function() {
    beforeEach(function() {
      setLocale("pl");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Anuluj");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Potwierdź");
    });
  });

  describe("Danish", function() {
    beforeEach(function() {
      setLocale("da");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Annuller");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Accepter");
    });
  });

  describe("Chinese", function() {

    describe("Taiwan", function() {
      beforeEach(function() {
        setLocale("zh_TW");
      });

      it("shows the correct OK translation", function() {
        expect(labels.ok).to.equal("OK");
      });

      it("shows the correct CANCEL translation", function() {
        expect(labels.cancel).to.equal("取消");
      });

      it("shows the correct CONFIRM translation", function() {
        expect(labels.confirm).to.equal("確認");
      });
    });

    describe("China", function() {
      beforeEach(function() {
        setLocale("zh_CN");
      });

      it("shows the correct OK translation", function() {
        expect(labels.ok).to.equal("OK");
      });

      it("shows the correct CANCEL translation", function() {
        expect(labels.cancel).to.equal("取消");
      });

      it("shows the correct CONFIRM translation", function() {
        expect(labels.confirm).to.equal("确认");
      });
    });
  });

  describe("Norwegian", function() {
    beforeEach(function() {
      setLocale("no");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Avbryt");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("OK");
    });
  });

  describe("Swedish", function() {
    beforeEach(function() {
      setLocale("sv");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Avbryt");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("OK");
    });
  });

  describe("Latvian", function() {
    beforeEach(function() {
      setLocale("lv");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("Labi");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Atcelt");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Apstiprināt");
    });
  });


  describe("Lithuanian", function() {
    beforeEach(function() {
      setLocale("lt");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("Gerai");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Atšaukti");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Patvirtinti");
    });
  });

  describe("Turkish", function() {
    beforeEach(function() {
      setLocale("tr");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("Tamam");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("İptal");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Onayla");
    });
  });

  describe("Hebrew", function() {
    beforeEach(function() {
      setLocale("he");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("אישור");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("ביטול");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("אישור");
    });
  });

  describe("Greek", function() {
    beforeEach(function() {
      setLocale("el");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("Εντάξει");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Ακύρωση");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Επιβεβαίωση");
    });
  });

  describe("Japanese", function() {
    beforeEach(function() {
      setLocale("ja");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("キャンセル");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("確認");
    });
  });

  describe("Hungarian", function() {
    beforeEach(function() {
      setLocale("hu");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Mégsem");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Megerősít");
    });
  });

  describe("Croatian", function() {
    beforeEach(function() {
      setLocale("hr");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Odustani");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Potvrdi");
    });
  });

  describe("Bulgarian", function() {
    beforeEach(function() {
      setLocale("bg_BG");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("Ок");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Отказ");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Потвърждавам");
    });
  });

  describe("Thai", function() {
    beforeEach(function() {
      setLocale("th");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("ตกลง");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("ยกเลิก");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("ยืนยัน");
    });
  });

  describe("Persian", function() {
    beforeEach(function() {
      setLocale("fa");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("قبول");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("لغو");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("تایید");
    });
  });

  describe("Ukrainian", function() {
      beforeEach(function() {
          setLocale("uk");
      });

    it("shows the correct OK translation", function() {
          expect(labels.ok).to.equal("OK");
      });

    it("shows the correct CANCEL translation", function() {
          expect(labels.cancel).to.equal("Відміна");
      });

    it("shows the correct CONFIRM translation", function() {
          expect(labels.confirm).to.equal("Прийняти");
      });
  });

  describe("Albanian", function() {
    beforeEach(function() {
      setLocale("sq");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Anulo");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Prano");
    });
  });

  describe("Slovenian", function() {
    beforeEach(function() {
      setLocale("sl");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Prekliči");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Potrdi");
    });
  });

  describe("Slovak", function() {
    beforeEach(function() {
      setLocale("sk");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("Zrušiť");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("Potvrdiť");
    });
  });

  describe("Korean", function() {
    beforeEach(function() {
      setLocale("ko");
    });

    it("shows the correct OK translation", function() {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", function() {
      expect(labels.cancel).to.equal("취소");
    });

    it("shows the correct CONFIRM translation", function() {
      expect(labels.confirm).to.equal("확인");
    });
  });
});
