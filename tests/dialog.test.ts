describe("bootprompt.dialog", () => {
  before((done) => {
    reload(done);
  });

  before(() => {
    bootprompt.setDefaults("animate", false);
  });

  describe("invalid usage tests", () => {
    describe("with no arguments", () => {
      it("throws an error", () => {
        // tslint:disable-next-line:no-any
        expect(() => (bootprompt as any).dialog()).to.throw(/supply an object/);
      });
    });

    describe("with one argument", () => {
      describe("where the argument is not an object", () => {
        it("throws an error", () => {
          // tslint:disable-next-line:no-any
          expect(() => bootprompt.dialog("test" as any))
            .to.throw(/supply an object/);
        });
      });

      describe("where the argument has no message property", () => {
        it("throws an error", () => {
          expect(() => bootprompt.dialog({
            invalid: "options",
            // tslint:disable-next-line:no-any
          } as any)).to.throw(/specify a message/);
        });
      });

      describe("where the argument has a button with an invalid value", () => {
        it("throws an error", () => {
          expect(() => bootprompt.dialog({
            message: "test",
            buttons: {
              ok: "foo",
            },
            // tslint:disable-next-line:no-any
          } as any)).to.throw(/button with key "ok" must be an object/);
        });
      });
    });
  });

  describe("when creating a minimal dialog", () => {
    let $dialog: JQuery;
    before(() => {
      $dialog = bootprompt.dialog({
        message: "test",
      });
    });

    it("adds the bootprompt class to the dialog", () => {
      expect($dialog[0].classList.contains("bootprompt")).to.be.true;
    });

    it("adds the bootstrap modal class to the dialog", () => {
      expect($dialog[0].classList.contains("modal")).to.be.true;
    });

    it("shows the expected message", () => {
      expect(text($dialog, ".bootprompt-body")).to.equal("test");
    });

    it("does not have a header", () => {
      expect(exists($dialog, ".modal-header")).to.be.false;
    });

    it("has a close button inside the body", () => {
      expect(exists($dialog, ".modal-body .close")).to.be.true;
    });

    it("does not have a footer", () => {
      expect(exists($dialog, ".modal-footer")).to.be.false;
    });

    it("has a backdrop", () => {
      expect(document.getElementsByClassName("modal-backdrop"))
        .to.be.lengthOf(1);
    });
  });

  describe("when creating a dialog with a button", () => {
    let $dialog: JQuery;
    let buttons: HTMLCollectionOf<HTMLElement>;

    describe("when the button has no callback", () => {
      function create(): void {
        $dialog = bootprompt.dialog({
          message: "test",
          buttons: {
            one: {
              label: "My Label",
            },
          },
        });
      }

      before(() => {
        create();
        buttons = ($dialog[0].getElementsByClassName("btn") as
                   HTMLCollectionOf<HTMLElement>);
      });

      it("shows a footer", () => {
        expect(exists($dialog, ".modal-footer")).to.be.true;
      });

      it("shows one button", () => {
        expect(buttons).to.be.lengthOf(1);
      });

      it("shows the correct button text", () => {
        expect(buttons[0]).to.have.property("textContent").equal("My Label");
      });

      it("applies the correct button class", () => {
        expect(buttons[0].classList.contains("btn-primary")).to.be.true;
      });

      describe("when triggering the escape event", () => {
        let hidden: sinon.SinonSpy<[Bootstrap.ModalOption?], JQuery>;

        before(() => {
          create();
          hidden = sinon.spy($dialog, "modal");
          $dialog.trigger("escape.close.bp");
        });

        it("should hide the modal", () => {
          expect(hidden).to.have.been.called;
        });
      });

      describe("when clicking the close button", () => {
        let hidden: sinon.SinonSpy<[Bootstrap.ModalOption?], JQuery>;

        before(() => {
          create();
          hidden = sinon.spy($dialog, "modal");
          $dialog.find(".close").trigger("click");
        });

        it("should hide the modal", () => {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });
    });

    describe("when the button has a label and callback", () => {
      let callback: sinon.SinonSpy;

      function create(): void {
        callback = sinon.spy();
        $dialog = bootprompt.dialog({
          message: "test",
          buttons: {
            one: {
              label: "Another Label",
              callback,
            },
          },
        });
      }

      before(() => {
        create();
      });

      it("shows a footer", () => {
        expect(exists($dialog, ".modal-footer")).to.be.true;
      });

      it("shows the correct button text", () => {
        expect(text($dialog, ".btn")).to.equal("Another Label");
      });

      describe("when dismissing the dialog by clicking OK", () => {
        let hidden: sinon.SinonSpy<[Bootstrap.ModalOption?], JQuery>;

        before(() => {
          create();
          hidden = sinon.spy($dialog, "modal");
          $($dialog[0].getElementsByClassName("btn-primary")[0])
            .trigger("click");
        });

        it("should invoke the callback", () => {
          expect(callback).to.have.been.called;
        });

        it(`should pass the dialog as "this"`, () => {
          expect(callback.thisValues[0]).to.equal($dialog);
        });

        it("should hide the modal", () => {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });

      describe("when triggering the escape event", () => {
        let hidden: sinon.SinonSpy<[Bootstrap.ModalOption?], JQuery>;

        before(() => {
          create();
          hidden = sinon.spy($dialog, "modal");
          $dialog.trigger("escape.close.bp");
        });

        it("should not invoke the callback", () => {
          expect(callback).not.to.have.been.called;
        });

        it("should hide the modal", () => {
          expect(hidden).to.have.been.called;
        });
      });

      describe("when clicking the close button", () => {
        let hidden: sinon.SinonSpy<[Bootstrap.ModalOption?], JQuery>;

        before(() => {
          create();
          hidden = sinon.spy($dialog, "modal");
          $($dialog[0].getElementsByClassName("close")[0]).trigger("click");
        });

        it("should not invoke the callback", () => {
          expect(callback).not.to.have.been.called;
        });

        it("should hide the modal", () => {
          expect(hidden).to.have.been.called;
        });
      });
    });

    describe("when the button has a custom class", () => {
      let button: HTMLElement;

      before(() => {
        $dialog = bootprompt.dialog({
          message: "test",
          buttons: {
            one: {
              label: "Test Label",
              className: "btn-custom",
            },
          },
        });

        button = $dialog[0].getElementsByClassName("btn")[0] as HTMLElement;
      });

      it("shows the correct button text", () => {
        expect(button).to.have.property("textContent").equal("Test Label");
      });

      it("adds the custom class to the button", () => {
        expect(button.classList.contains("btn-custom")).to.be.true;
      });
    });

    describe("when the button has no explicit label", () => {
      describe("when its value is an object", () => {
        let button: HTMLElement;

        before(() => {
          $dialog = bootprompt.dialog({
            message: "test",
            buttons: {
              "Short form": {
                className: "btn-custom",
                callback: () => true,
              },
            },
          });

          button = $dialog[0].getElementsByClassName("btn")[0] as HTMLElement;
        });

        it("uses the key name as the button text", () => {
          expect(button).to.have.property("textContent").equal("Short form");
        });

        it("adds the custom class to the button", () => {
          expect(button.classList.contains("btn-custom")).to.be.true;
        });
      });

      describe("when its value is a function", () => {
        let callback: sinon.SinonSpy;

        function createDialog(): void {
          callback = sinon.spy();
          $dialog = bootprompt.dialog({
            message: "test",
            buttons: {
              my_label: callback,
            },
          });
        }

        before(() => {
          createDialog();
        });

        it("uses the key name as the button text", () => {
          expect(text($dialog, ".btn")).to.equal("my_label");
        });

        describe("when dismissing the dialog by clicking the button", () => {
          before(() => {
            createDialog();
            $($dialog[0].getElementsByClassName("btn-primary")[0])
              .trigger("click");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });
        });
      });

      describe("when its value is not an object or function", () => {
        it("throws an error", () => {
          expect(() => bootprompt.dialog({
            message: "test",
            buttons: {
              "Short form": "hello world",
            },
            // tslint:disable-next-line:no-any
          } as any)).to.throw(/button with key "Short form" must be an object/);
        });
      });
    });
  });

  describe("when creating a dialog with a string title", () => {
    let $dialog: JQuery;
    before(() => {
      $dialog = bootprompt.dialog({
        title: "My Title",
        message: "test",
      });
    });

    it("has a header", () => {
      expect(exists($dialog, ".modal-header")).to.be.true;
    });

    it("shows the correct title text", () => {
      expect(text($dialog, ".modal-title")).to.equal("My Title");
    });

    it("has a close button inside the header", () => {
      expect(exists($dialog, ".modal-header .close")).to.be.true;
    });
  });

  describe("when creating a dialog with an element title", () => {
    let $dialog: JQuery;
    let html: string;
    before(() => {
      html = "<span>My Title</span>";
      $dialog = bootprompt.dialog({
        title: $(html),
        message: "test",
      });
    });

    it("has a header", () => {
      expect(exists($dialog, ".modal-header")).to.be.true;
    });

    it("shows the correct title text", () => {
      expect(find($dialog, ".modal-title").innerHTML).to.equal(html);
    });

    it("has a close button inside the header", () => {
      expect(exists($dialog, ".modal-header .close")).to.be.true;
    });
  });

  describe("when creating a dialog with no backdrop", () => {
    before(() => {
      // The suite does not systematically cleanup old modals.
      bootprompt.hideAll();
      const backdrops = document.getElementsByClassName("modal-backdrop");
      expect(backdrops).to.be.lengthOf(0);
      bootprompt.dialog({
        message: "No backdrop in sight",
        backdrop: false,
      });
    });

    it("does not have a backdrop", () => {
      expect(document.getElementsByClassName("modal-backdrop")).to.be
        .lengthOf(0);
    });
  });

  describe("when creating a dialog with no close button", () => {
    let $dialog: JQuery;

    before(() => {
      $dialog = bootprompt.dialog({
        message: "No backdrop in sight",
        closeButton: false,
      });
    });

    it("does not have a close button inside the body", () => {
      expect(exists($dialog, ".modal-body .close")).to.be.false;
    });
  });

  describe("when creating a dialog without onEscape", () => {
    let $dialog: JQuery;

    let hidden: sinon.SinonSpy<[Bootstrap.ModalOption?], JQuery>;
    let trigger: sinon.SinonSpy<[string | JQuery.Event,
                                 // tslint:disable-next-line:no-any
                                 (string | number | boolean | any[] |
                                  JQuery.PlainObject)?], JQuery>;

    function createDialog(): void {
      $dialog = bootprompt.dialog({
        message: "Are you sure?",
      });
      hidden = sinon.spy($dialog, "modal");
      trigger = sinon.spy($dialog, "trigger").withArgs("escape.close.bp");
    }

    function e(keyCode: number): void {
      $dialog.trigger($.Event("keyup", {
        which: keyCode,
      }));
    }

    describe("when triggering the keyup event", () => {
      describe("when the key is not the escape key", () => {
        before(() => {
          createDialog();
          e(15);
        });

        it("does not trigger the escape event", () => {
          expect(trigger).not.to.have.been.called;
        });

        it("should not hide the modal", () => {
          expect(hidden).not.to.have.been.called;
        });
      });

      describe("when the key is the escape key", () => {
        before(() => {
          createDialog();
          e(27);
        });

        it("triggers the escape event", () => {
          expect(trigger).to.have.been.calledWithExactly("escape.close.bp");
        });

        it("should hide the modal", () => {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });
    });
  });

  describe("when creating a dialog without onEscape false", () => {
    let $dialog: JQuery;

    let hidden: sinon.SinonSpy<[Bootstrap.ModalOption?], JQuery>;
    let trigger: sinon.SinonSpy<[string | JQuery.Event,
                                 // tslint:disable-next-line:no-any
                                 (string | number | boolean | any[] |
                                  JQuery.PlainObject)?], JQuery>;

    function createDialog(): void {
      $dialog = bootprompt.dialog({
        message: "Are you sure?",
        onEscape: false,
      });
      hidden = sinon.spy($dialog, "modal");
      trigger = sinon.spy($dialog, "trigger").withArgs("escape.close.bp");
    }

    function e(keyCode: number): void {
      $dialog.trigger($.Event("keyup", {
        which: keyCode,
      }));
    }

    describe("when hitting the escape key", () => {
      before(() => {
        createDialog();
        e(27);
      });

      it("triggers the escape event", () => {
        expect(trigger).to.have.been.calledWithExactly("escape.close.bp");
      });

      it("should not hide the modal", () => {
        expect(hidden).to.not.have.been.calledWithExactly("hide");
      });
    });
  });

  describe("when creating a dialog with an onEscape handler", () => {
    let $dialog: JQuery;

    function e(keyCode: number): void {
      $dialog.trigger($.Event("keyup", {
        which: keyCode,
      }));
    }

    describe("with a simple callback", () => {
      let callback: sinon.SinonSpy;
      let hidden: sinon.SinonSpy<[Bootstrap.ModalOption?], JQuery>;
      let trigger: sinon.SinonSpy<[string | JQuery.Event,
                                   // tslint:disable-next-line:no-any
                                   (string | number | boolean | any[] |
                                    JQuery.PlainObject)?], JQuery>;

      function createDialog(): void {
        callback = sinon.spy();
        $dialog = bootprompt.dialog({
          message: "Are you sure?",
          onEscape: callback,
        });
        hidden = sinon.spy($dialog, "modal");
        trigger = sinon.spy($dialog, "trigger").withArgs("escape.close.bp");
      }

      describe("when triggering the keyup event", () => {
        describe("when the key is not the escape key", () => {
          before(() => {
            createDialog();
            e(15);
          });

          it("does not trigger the escape event", () => {
            expect(trigger).not.to.have.been.called;
          });

          it("should not hide the modal", () => {
            expect(hidden).not.to.have.been.called;
          });
        });

        describe("when the key is the escape key", () => {
          before(() => {
            createDialog();
            e(27);
          });

          it("triggers the escape event", () => {
            expect(trigger).to.have.been.calledWithExactly("escape.close.bp");
          });

          it("should invoke the callback", () => {
            expect(callback).to.have.been.called;
          });

          it(`should pass the dialog as "this"`, () => {
            expect(callback.thisValues[0]).to.equal($dialog);
          });

          it("should hide the modal", () => {
            expect(hidden).to.have.been.calledWithExactly("hide");
          });
        });
      });
    });

    describe("with a callback which returns false", () => {
      let callback: sinon.SinonSpy;
      let hidden: sinon.SinonSpy<[Bootstrap.ModalOption?], JQuery>;

      function createDialog(): void {
        callback = sinon.stub().returns(false);
        $dialog = bootprompt.dialog({
          message: "Are you sure?",
          onEscape: callback,
        });
        hidden = sinon.spy($dialog, "modal");
      }

      describe("when triggering the escape keyup event", () => {
        before(() => {
          createDialog();
          e(27);
        });

        it("should invoke the callback", () => {
          expect(callback).to.have.been.called;
        });

        it(`should pass the dialog as "this"`, () => {
          expect(callback.thisValues[0]).to.equal($dialog);
        });

        it("should not hide the modal", () => {
          expect(hidden).not.to.have.been.called;
        });
      });

      describe("when clicking the close button", () => {
        before(() => {
          createDialog();
          $($dialog[0].getElementsByClassName("close")[0]).trigger("click");
        });

        it("should not invoke the callback", () => {
          expect(callback).to.not.have.been.called;
        });

        it("should hide the modal", () => {
          expect(hidden).to.have.been.called;
        });
      });
    });
  });

  describe("when creating a dialog with an onClose handler", () => {
    let $dialog: JQuery;
    let callback: sinon.SinonSpy;
    let hidden: sinon.SinonSpy<[Bootstrap.ModalOption?], JQuery>;

    function createDialog(): void {
      $dialog = bootprompt.dialog({
        message: "Are you sure?",
        onClose: callback,
      });

      hidden = sinon.spy($dialog, "modal");
    }

    function shouldInvokeCallback(): void {
      it("should invoke the callback", () => {
        expect(callback).to.have.been.calledOnce;
      });

      it(`should pass the dialog as "this"`, () => {
        expect(callback.thisValues[0]).to.equal($dialog);
      });

      it("should pass the event as first argument", () => {
        expect(callback.args[0][0]).to.be.instanceof($.Event);
      });
    }

    describe("with a simple callback", () => {
      describe("when clicking the close button", () => {
        before(() => {
          callback = sinon.spy();
          createDialog();
          $dialog.find(".close").trigger("click");
        });

        // tslint:disable-next-line:mocha-no-side-effect-code
        shouldInvokeCallback();

        it("should hide the modal", () => {
          expect(hidden).to.have.been.calledOnceWithExactly("hide");
        });
      });
    });

    describe("with a callback which returns false", () => {
      describe("when clicking the close button", () => {
        before(() => {
          callback = sinon.stub().returns(false);
          createDialog();
          $dialog.find(".close").trigger("click");
        });

        // tslint:disable-next-line:mocha-no-side-effect-code
        shouldInvokeCallback();

        it("should not hide the modal", () => {
          expect(hidden).to.not.have.been.called;
        });
      });
    });
  });

  describe("with size option", () => {
    let $dialog: JQuery;

    describe("when the size option is set to large", () => {
      before(() => {
        $dialog = bootprompt.dialog({
          message: "test",
          size: "large",
        });
      });

      it("adds the large class to the innerDialog", () => {
        expect($dialog[0].getElementsByClassName("modal-dialog")[0].classList
               .contains("modal-lg")).to.be.true;
      });
    });

    describe("when the size option is set to small", () => {
      before(() => {
        $dialog = bootprompt.dialog({
          message: "test",
          size: "small",
        });
      });

      it("adds the small class to the innerDialog", () => {
        expect($dialog[0].getElementsByClassName("modal-dialog")[0].classList
               .contains("modal-sm")).to.be.true;
      });
    });

    describe("when the size option is set to an unsupported value", () => {
      it("throws an error", () => {
        expect(() => bootprompt.dialog({
          message: "test",
          // tslint:disable-next-line:no-any
          size: "fnord" as any,
        })).to.throw(Error, "unknown size value: fnord");
      });
    });
  });
});
