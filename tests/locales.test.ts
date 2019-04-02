describe("bootprompt locales", () => {
  let labels: Record<"ok" | "cancel" | "confirm", string>;

  function setLocale(locale: string): void {
    bootprompt.setLocale(locale);
    const d1 = bootprompt.alert("foo");
    const d2 = bootprompt.confirm("foo", () => true);

    labels = {
      ok: d1.find(".btn:first").text(),
      cancel: d2.find(".btn:first").text(),
      confirm: d2.find(".btn:last").text(),
    };
  }

  describe("Invalid locale", () => {
    before(() => {
      setLocale("xx");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the default OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the default CANCEL translation", () => {
      expect(labels.cancel).to.equal("Cancel");
    });

    it("shows the default CONFIRM translation", () => {
      expect(labels.confirm).to.equal("OK");
    });
  });

  describe("Arabic", () => {
    before(() => {
      setLocale("ar");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("موافق");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("الغاء");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("تأكيد");
    });
  });

  describe("Azerbaijani", () => {
    before(() => {
      setLocale("az");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("İmtina et");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Təsdiq et");
    });
  });

  describe("English", () => {
    before(() => {
      setLocale("en");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Cancel");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("OK");
    });
  });

  describe("French", () => {
    before(() => {
      setLocale("fr");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Annuler");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Confirmer");
    });
  });

  describe("German", () => {
    before(() => {
      setLocale("de");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Abbrechen");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Akzeptieren");
    });
  });

  describe("Spanish", () => {
    before(() => {
      setLocale("es");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Cancelar");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Aceptar");
    });
  });

  describe("Basque", () => {
    before(() => {
      setLocale("eu");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });
    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Ezeztatu");
    });
    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Onartu");
    });
  });

  describe("Portuguese", () => {
    before(() => {
      setLocale("pt-br");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Cancelar");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Sim");
    });
  });

  describe("Dutch", () => {
    before(() => {
      setLocale("nl");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Annuleren");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Accepteren");
    });
  });

  describe("Russian", () => {
    before(() => {
      setLocale("ru");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Отмена");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Подтвердить");
    });
  });

  describe("Indonesian", () => {
    before(() => {
      setLocale("id");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Batal");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("OK");
    });
  });

  describe("Italian", () => {
    before(() => {
      setLocale("it");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Annulla");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Conferma");
    });
  });

  describe("Polish", () => {
    before(() => {
      setLocale("pl");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Anuluj");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Potwierdź");
    });
  });

  describe("Danish", () => {
    before(() => {
      setLocale("da");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Annuller");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Accepter");
    });
  });

  describe("Taiwan", () => {
    before(() => {
      setLocale("zh_TW");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("取消");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("確認");
    });
  });

  describe("Chinese (China)", () => {
    before(() => {
      setLocale("zh_CN");
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("取消");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("确认");
    });
  });

  describe("Norwegian", () => {
    before(() => {
      setLocale("no");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Avbryt");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("OK");
    });
  });

  describe("Swedish", () => {
    before(() => {
      setLocale("sv");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Avbryt");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("OK");
    });
  });

  describe("Latvian", () => {
    before(() => {
      setLocale("lv");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("Labi");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Atcelt");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Apstiprināt");
    });
  });

  describe("Lithuanian", () => {
    before(() => {
      setLocale("lt");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("Gerai");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Atšaukti");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Patvirtinti");
    });
  });

  describe("Turkish", () => {
    before(() => {
      setLocale("tr");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("Tamam");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("İptal");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Onayla");
    });
  });

  describe("Hebrew", () => {
    before(() => {
      setLocale("he");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("אישור");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("ביטול");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("אישור");
    });
  });

  describe("Greek", () => {
    before(() => {
      setLocale("el");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("Εντάξει");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Ακύρωση");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Επιβεβαίωση");
    });
  });

  describe("Japanese", () => {
    before(() => {
      setLocale("ja");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("キャンセル");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("確認");
    });
  });

  describe("Hungarian", () => {
    before(() => {
      setLocale("hu");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Mégsem");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Megerősít");
    });
  });

  describe("Croatian", () => {
    before(() => {
      setLocale("hr");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Odustani");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Potvrdi");
    });
  });

  describe("Bulgarian", () => {
    before(() => {
      setLocale("bg_BG");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("Ок");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Отказ");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Потвърждавам");
    });
  });

  describe("Thai", () => {
    before(() => {
      setLocale("th");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("ตกลง");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("ยกเลิก");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("ยืนยัน");
    });
  });

  describe("Persian", () => {
    before(() => {
      setLocale("fa");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("قبول");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("لغو");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("تایید");
    });
  });

  describe("Ukrainian", () => {
    before(() => {
      setLocale("uk");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Відміна");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Прийняти");
    });
  });

  describe("Albanian", () => {
    before(() => {
      setLocale("sq");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Anulo");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Prano");
    });
  });

  describe("Slovenian", () => {
    before(() => {
      setLocale("sl");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Prekliči");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Potrdi");
    });
  });

  describe("Slovak", () => {
    before(() => {
      setLocale("sk");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("Zrušiť");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("Potvrdiť");
    });
  });

  describe("Korean", () => {
    before(() => {
      setLocale("ko");
    });

    after(() => {
      bootprompt.hideAll();
    });

    it("shows the correct OK translation", () => {
      expect(labels.ok).to.equal("OK");
    });

    it("shows the correct CANCEL translation", () => {
      expect(labels.cancel).to.equal("취소");
    });

    it("shows the correct CONFIRM translation", () => {
      expect(labels.confirm).to.equal("확인");
    });
  });
});
