describe("bootprompt.alert", () => {
  "use strict";

  before(() => {
    bootprompt.setDefaults("animate", false);
  });

  describe("basic usage tests", () => {
    describe("with no arguments", () => {
      it("throws an error", () => {
        // tslint:disable-next-line:no-any
        expect(() => (bootprompt as any).alert()).to.throw();
      });
    });

    describe("with one argument", () => {
      let $dialog: JQuery;

      describe("where the argument is a string", () => {
        let footerButton: HTMLElement;
        let bodyButton: HTMLElement;
        before(() => {
          $dialog = bootprompt.alert("Hello world!");
          footerButton =
            $dialog[0].querySelector(".modal-footer button") as HTMLElement;
          bodyButton =
            $dialog[0].querySelector(".modal-body button") as HTMLElement;
        });

        it("applies the bootprompt-alert class to the dialog", () => {
          expect($dialog[0].classList.contains("bootprompt-alert")).to.be.true;
        });

        it("shows the expected body copy", () => {
          expect(text($dialog, ".bootprompt-body")).to.equal("Hello world!");
        });

        it("shows an OK button", () => {
          expect(footerButton).to.have.property("textContent").equal("OK");
        });

        it("applies the primary class to the button", () => {
          expect(footerButton.classList.contains("btn-primary")).to.be.true;
        });

        it("applies the bootprompt-accept class to the button", () => {
          expect(footerButton.classList.contains("bootprompt-accept")).to.be
            .true;
        });

        it("shows a close button inside the body", () => {
          expect(bodyButton).to.have.property("textContent").equal("×");
        });

        it("applies the close class to the close button", () => {
          expect(bodyButton.classList.contains("close")).to.be.true;
        });

        it("applies correct aria-hidden attribute to the close button", () => {
          expect(find($dialog, "button.close").getAttribute("aria-hidden"))
            .to.equal("true");
        });

        it("applies the correct class to the body", () => {
          expect(document.body.classList.contains("modal-open")).to.be.true;
        });
      });
    });

    describe("with two arguments", () => {
      describe("where the second argument is not a function", () => {
        it("throws an error requiring a callback", () => {
          expect(() => bootprompt.alert("Hello world!",
                                        // tslint:disable-next-line:no-any
                                        "not a callback" as any))
            .to.throw(new RegExp("alert requires callback property to be a \
function when provided"));
        });
      });

      describe("where the second argument is a function", () => {
        it("does not throw an error", () => {
          // tslint:disable-next-line:no-empty
          expect(() => bootprompt.alert("Hello world!", () => {}))
            .not.to.throw();
        });
      });
    });
  });

  describe("configuration options tests", () => {
    describe("with a custom ok button", () => {
      let button: HTMLElement;
      let $dialog: JQuery;

      before(() => {
        $dialog = bootprompt.alert({
          message: "Hello world",
          // tslint:disable-next-line:no-empty
          callback: () => {},
          buttons: {
            ok: {
              label: "Custom OK",
              className: "btn-danger",
            },
          },
        });

        button = $dialog[0].querySelector(".btn") as HTMLElement;
      });

      it("adds the correct ok button", () => {
        expect(button.textContent).to.equal("Custom OK");
        expect(button.classList.contains("btn-danger")).to.be.true;
        expect(button.classList.contains("bootprompt-accept")).to.be.true;
      });
    });

    describe("with an unrecognised button key", () => {
      it("throws an error", () => {
        expect(() => bootprompt.alert({
          message: "Hello world",
          // tslint:disable-next-line:no-empty
          callback: () => {},
          buttons: {
            "Another key": {
              label: "Custom OK",
              className: "btn-danger",
            },
          },
          // tslint:disable-next-line:no-any
        } as any))
          .to.throw(`button key "Another key" is not allowed (options are ok)`);
      });
    });

    describe("with a custom title", () => {
      let $dialog: JQuery;

      before(() => {
        $dialog = bootprompt.alert({
          message: "Hello world",
          // tslint:disable-next-line:no-empty
          callback: () => {},
          title: "Hello?",
        });
      });

      it("shows the correct title", () => {
        expect(text($dialog, ".modal-title")).to.equal("Hello?");
      });
    });
  });

  describe("callback tests", () => {
    describe("with no callback", () => {
      let hidden: sinon.SinonSpy;
      let $dialog: JQuery;

      function createDialog(): void {
        $dialog = bootprompt.alert({
          message: "Hello!",
        });

        hidden = sinon.spy($dialog, "modal");
      }

      describe("when dismissing the dialog by clicking OK", () => {
        before(() => {
          createDialog();
          $dialog.find(".bootprompt-accept").trigger("click");
        });

        it("should hide the modal", () => {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });

      describe("when clicking the close button", () => {
        before(() => {
          createDialog();
          $dialog.find(".close").trigger("click");
        });

        it("should hide the modal", () => {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });

      describe("when triggering the escape event", () => {
        before(() => {
          createDialog();
          $dialog.trigger("escape.close.bb");
        });

        it("should hide the modal", () => {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });
    });

    describe("with a simple callback", () => {
      let callback: sinon.SinonSpy;
      let $dialog: JQuery;
      let hidden: sinon.SinonSpy;

      function createDialog(): void {
        callback = sinon.spy();

        $dialog = bootprompt.alert({
          message: "Hello!",
          callback,
        });

        hidden = sinon.spy($dialog, "modal");
      }

      describe("when dismissing the dialog by clicking OK", () => {
        before(() => {
          createDialog();
          $dialog.find(".bootprompt-accept").trigger("click");
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

      describe("when clicking the close button", () => {
        before(() => {
          createDialog();
          $dialog.find(".close").trigger("click");
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
        before(() => {
          createDialog();
          $dialog.trigger("escape.close.bb");
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

    describe("with a callback which returns false", () => {
      let $dialog: JQuery;
      let callback: sinon.SinonStub;
      let hidden: sinon.SinonSpy;

      function createDialog(): void {
        callback = sinon.stub();
        callback.returns(false);

        $dialog = bootprompt.alert({
          message: "Hello!",
          callback,
        });

        hidden = sinon.spy($dialog, "modal");
      }

      describe("when dismissing the dialog by clicking OK", () => {
        before(() => {
          createDialog();
          $dialog.find(".bootprompt-accept").trigger("click");
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
          $dialog.find(".close").trigger("click");
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

      describe("when triggering the escape event", () => {
        before(() => {
          createDialog();
          $dialog.trigger("escape.close.bb");
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
    });
  });
});
