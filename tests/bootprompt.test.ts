describe("Bootprompt", () => {
  before(() => {
    bootprompt.setAnimate(false);
  });

  it("is attached to the window object", () => {
    expect(bootprompt).to.be.an("object");
  });

  it("exposes the correct public API", () => {
    expect(bootprompt.alert).to.be.a("function");
    expect(bootprompt.confirm).to.be.a("function");
    expect(bootprompt.dialog).to.be.a("function");
    expect(bootprompt.setAnimate).to.be.a("function");
    expect(bootprompt.setLocale).to.be.a("function");
    expect(bootprompt.removeLocale).to.be.a("function");
    expect(bootprompt.locales).to.be.a("function");
    expect(bootprompt.hideAll).to.be.a("function");
  });

  describe("hideAll", () => {
    let hidden: sinon.SinonSpy<[Bootstrap.ModalOption?], JQuery>;

    before(() => {
      hidden = sinon.spy($.fn, "modal");
      bootprompt.hideAll();
    });

    after(() => {
      hidden.restore();
    });

    it("should hide all .bootprompt modals", () => {
      expect(hidden).to.have.been.calledWithExactly("hide");
    });
  });

  describe("event listeners", () => {
    describe("hidden.bs.modal", () => {
      let $dialog: JQuery;

      // tslint:disable-next-line:no-any
      function trigger(target: any): void {
        $dialog.trigger($.Event("hidden.bs.modal", { target }));
      }

      beforeEach(() => {
        $dialog = bootprompt.alert("hi remove");
      });

      afterEach(() => {
        // We cannot use hide all because hidden.bs.modal is added with .one
        // and hideAll won't trigger it again.
        $dialog.remove();
        // We also have to remove the backdrop ourselves.
        $(".modal-backdrop").remove();
      });

      describe("when triggered with the wrong target", () => {
        beforeEach(() => {
          trigger({an: "object"});
        });

        it("does not remove the dialog", () => {
          expect(document.contains($dialog[0])).to.be.true;
        });
      });

      describe("when triggered with the correct target", () => {
        beforeEach(() => {
          trigger($dialog[0]);
        });

        it("removes the dialog", () => {
          expect(document.contains($dialog[0])).to.be.false;
        });
      });
    });
  });

  describe("bootprompt.locales", () => {
    it("returns a specific locale", () => {
      expect(bootprompt.locales("en")).to.have.keys("OK", "CANCEL", "CONFIRM");
    });

    it("returns undefined on unknown locale", () => {
      expect(bootprompt.locales("zz")).to.be.undefined;
    });

    it("returns all locales if no arg is passed", () => {
      // We check only whether the en locale is on the object.
      expect(bootprompt.locales()).to.contain.keys("en");
    });
  });

  describe("adding and removing locales", () => {
    describe("bootprompt.addLocale", () => {
      describe("with invalid values", () => {
        it("throws the expected error", () => {
          expect(() => {
            bootprompt.addLocale("xy", {
              OK: "BTN1",
              // tslint:disable-next-line:no-any
            } as any);
          }).to.throw(Error, `Please supply a translation for "CANCEL"`);
        });
      });

      describe("with valid values", () => {
        let labels: Record<"ok" | "cancel" | "confirm", string>;

        before(() => {
          bootprompt
          .addLocale("xy", {
            OK: "BTN1",
            CANCEL: "BTN2",
            CONFIRM: "BTN3",
          });
          bootprompt.setLocale("xy");

          const d1 = bootprompt.alert("foo");
          const d2 = bootprompt.confirm("foo", () => true);
          labels = {
            ok: d1.find(".btn:first").text(),
            cancel: d2.find(".btn:first").text(),
            confirm: d2.find(".btn:last").text(),
          };
        });

        after(() => {
          bootprompt.hideAll();
        });

        it("shows the expected OK translation", () => {
          expect(labels.ok).to.equal("BTN1");
        });

        it("shows the expected CANCEL translation", () => {
          expect(labels.cancel).to.equal("BTN2");
        });

        it("shows the expected PROMPT translation", () => {
          expect(labels.confirm).to.equal("BTN3");
        });
      });
    });

    describe("bootprompt.removeLocale", () => {
      let labels: Record<"ok" | "cancel" | "confirm", string>;

      before(() => {
        bootprompt.removeLocale("xy");

        const d1 = bootprompt.alert("foo");
        const d2 = bootprompt.confirm("foo", () => true);
        labels = {
          ok: d1.find(".btn:first").text(),
          cancel: d2.find(".btn:first").text(),
          confirm: d2.find(".btn:last").text(),
        };
      });

      after(() => {
        bootprompt.hideAll();
      });

      it("falls back to the default OK translation", () => {
        expect(labels.ok).to.equal("OK");
      });

      it("falls back to the default CANCEL translation", () => {
        expect(labels.cancel).to.equal("Cancel");
      });

      it("falls back to the default PROMPT translation", () => {
        expect(labels.confirm).to.equal("OK");
      });

      it("fails when trying to remove 'en'", () => {
        expect(() => bootprompt.removeLocale("en"))
          .to.throw(Error, `"en" is used as the default and fallback locale \
and cannot be removed.`);
      });
    });
  });

  describe("backdrop variations", () => {
    let $dialog: JQuery;

    // tslint:disable-next-line:no-any
    function trigger(target: any): void {
      expect(target).to.not.be.null;
      expect(target).to.not.be.undefined;
      $dialog.trigger($.Event("click.dismiss.bs.modal", { target }));
    }

    describe("with the default value", () => {
      describe("When triggering the backdrop click dismiss event", () => {
        let callback: sinon.SinonSpy;

        before(() => {
          callback = sinon.spy();
          $dialog = bootprompt.alert("hi", callback);
          trigger({an: "object"});
        });

        after(() => {
          bootprompt.hideAll();
        });

        it("does not invoke the callback", () => {
          expect(callback).not.to.have.been.called;
        });
      });
    });

    describe("when set to false", () => {
      let callback: sinon.SinonSpy;

      function createDialog(): void {
        callback = sinon.spy();
        $dialog = bootprompt.alert({
          message: "backdrop false",
          callback,
          backdrop: false,
        });
      }

      describe("When triggering the backdrop click dismiss event", () => {
        describe("With the wrong target", () => {
          before(() => {
            createDialog();
            trigger({an: "object"});
          });

          after(() => {
            bootprompt.hideAll();
          });

          it("does not invoke the callback", () => {
            expect(callback).not.to.have.been.called;
          });
        });

        describe("With the correct target", () => {
          before(() => {
            createDialog();
            trigger($dialog[0]);
          });

          after(() => {
            bootprompt.hideAll();
          });

          it("invokes the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });
        });
      });
    });

    describe("when set to true", () => {
      let callback: sinon.SinonStub;

      function createDialog(): void {
        callback = sinon.stub();
        callback.returns(true);
        $dialog = bootprompt.alert({
          message: "backdrop true",
          callback,
          backdrop: true,
        });
      }

      describe("When triggering the backdrop click dismiss event", () => {
        describe("With the wrong target", () => {
          before(() => {
            createDialog();
            trigger({an: "object"});
          });

          after(() => {
            bootprompt.hideAll();
          });

          it("does not invoke the callback", () => {
            expect(callback).not.to.have.been.called;
          });
        });

        describe("With the correct target", () => {
          before(() => {
            const backdrops = document.getElementsByClassName("modal-backdrop");
            expect(backdrops).to.be.lengthOf(0);
            createDialog();
            expect(backdrops).to.be.lengthOf(1);

            // We're trying to simulate what a user would do clicking outside
            // the modal. In 3.3.x the backdrop is a child of the modal.
            if ($dialog[0].contains(backdrops[0])) {
              trigger(backdrops[0]);
            }
            else {
              trigger($dialog[0]);
            }
          });

          after(() => {
            bootprompt.hideAll();
          });

          it("invokes the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });
        });
      });
    });
  });
});
