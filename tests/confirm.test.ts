describe("bootprompt.confirm", () => {
  before(() => {
    bootprompt.setDefaults("animate", false);
  });

  describe("basic usage tests", () => {
    describe("with one argument", () => {
      describe("where the argument is not an object", () => {
        it("throws an error", () => {
          // tslint:disable-next-line:no-any
          expect(() => (bootprompt as any).confirm("Are you sure?")).to
            .throw(/confirm requires a callback/);
        });
      });

      describe("where the argument is an object", () => {
        describe("with a message property", () => {
          it("throws an error requiring a callback", () => {
            expect(() => bootprompt.confirm({
              message: "Are you sure?",
            })).to.throw(/confirm requires a callback/);
          });
        });

        describe("with a callback property", () => {
          describe("where the callback is not a function", () => {
            it("throws an error requiring a callback", () => {
              expect(() => bootprompt.confirm({
                callback: "string",
                // tslint:disable-next-line:no-any
              } as any)).to.throw(/confirm requires a callback/);
            });
          });

          describe("where the callback is a function", () => {
            it("throws an error requiring a message", () => {
              expect(() => bootprompt.confirm({
                callback: () => true,
                // tslint:disable-next-line:no-any
              } as any)).to.throw(/Please specify a message/);
            });
          });
        });

        describe("with a message and a callback", () => {
          let $dialog: JQuery;
          let first: HTMLElement;
          let second: HTMLElement;

          before(() => {
            $dialog = bootprompt.confirm({
              callback: () => true,
              message: "Are you sure?",
            });

            const buttons = ($dialog[0].getElementsByClassName("btn") as
                             HTMLCollectionOf<HTMLElement>);
            first = buttons[0];
            second = buttons[1];
          });

          it("creates a dialog object", () => {
            expect($dialog).to.be.an("object");
          });

          it("adds the correct button labels", () => {
            expect(first).to.have.property("textContent").equal("Cancel");
            expect(second).to.have.property("textContent").equal("OK");
          });

          it("adds the correct button classes", () => {
            expect(first.classList.contains("btn-default")).to.be.true;
            expect(first.classList.contains("btn-secondary")).to.be.true;
            expect(first.classList.contains("bootprompt-cancel")).to.be.true;

            expect(second.classList.contains("btn-primary")).to.be.true;
            expect(second.classList.contains("bootprompt-accept")).to.be.true;
          });

        });
      });
    });
    describe("with two arguments", () => {
      describe("where the second argument is not a function", () => {
        it("throws an error requiring a callback", () => {
          expect(() => bootprompt.confirm("Are you sure?",
                                          // tslint:disable-next-line:no-any
                                          "callback here" as any))
            .to.throw(/confirm requires a callback/);
        });
      });

      describe("where the second argument is a function", () => {
        let $dialog: JQuery;
        let first: HTMLElement;
        let second: HTMLElement;

        before(() => {
          $dialog = bootprompt.confirm("Are you sure?", () => true);

          const buttons = ($dialog[0].getElementsByClassName("btn") as
                           HTMLCollectionOf<HTMLElement>);
          first = buttons[0];
          second = buttons[1];
        });

        it("creates a dialog object", () => {
          expect($dialog).to.be.an("object");
        });

        it("applies the bootprompt-confirm class to the dialog", () => {
          expect($dialog[0].classList.contains("bootprompt-confirm")).to.be
            .true;
        });

        it("adds the correct button labels", () => {
          expect(first).to.have.property("textContent").equal("Cancel");
          expect(second).to.have.property("textContent").equal("OK");
        });

        it("adds the correct button classes", () => {
          expect(first.classList.contains("btn-default")).to.be.true;
          expect(first.classList.contains("btn-secondary")).to.be.true;
          expect(first.classList.contains("bootprompt-cancel")).to.be.true;

          expect(second.classList.contains("btn-primary")).to.be.true;
          expect(second.classList.contains("bootprompt-accept")).to.be.true;
        });

        it("shows the dialog", () => {
          expect($dialog.is(":visible")).to.be.true;
        });
      });
    });
  });
  describe("configuration options tests", () => {
    describe("with a custom cancel button", () => {
      let button: HTMLElement;
      let $dialog: JQuery;

      before(() => {
        $dialog = bootprompt.confirm({
          message: "Are you sure?",
          callback: () => true,
          buttons: {
            cancel: {
              label: "Custom cancel",
              className: "btn-danger",
            },
          },
        });

        button = $dialog[0].getElementsByClassName("btn")[0] as HTMLElement;
      });

      it("adds the correct cancel button", () => {
        expect(button.textContent).to.equal("Custom cancel");
        expect(button.classList.contains("btn-danger")).to.be.true;
      });
    });

    describe("with a custom confirm button", () => {
      let button: HTMLElement;
      let $dialog: JQuery;

      before(() => {
        $dialog = bootprompt.confirm({
          message: "Are you sure?",
          callback: () => true,
          buttons: {
            confirm: {
              label: "Custom confirm",
              className: "btn-warning",
            },
          },
        });

        button = $dialog[0].getElementsByClassName("btn")[1] as HTMLElement;
      });

      it("adds the correct confirm button", () => {
        expect(button.textContent).to.equal("Custom confirm");
        expect(button.classList.contains("btn-warning")).to.be.true;
      });
    });

    describe("with an unrecognised button key", () => {
      it("throws an error", () => {
        expect(() => bootprompt.confirm({
          message: "Are you sure?",
          callback: () => true,
          buttons: {
            "Bad key": {
              label: "Custom confirm",
              className: "btn-warning",
            },
          },
        })).to.throw(`button key "Bad key" is not allowed (options are \
cancel confirm)`);
      });
    });
  });

  describe("callback tests", () => {
    describe("with a simple callback", () => {
      let callback: sinon.SinonSpy;
      let hidden: sinon.SinonSpy;
      let $dialog: JQuery;

      function createDialog(): void {
        callback = sinon.spy();
        $dialog = bootprompt.confirm({
          message: "Are you sure?",
          callback,
        });

        hidden = sinon.spy($dialog, "modal");
      }

      describe("when dismissing the dialog by clicking OK", () => {
        before(() => {
          createDialog();
          $(find($dialog, ".bootprompt-accept")).trigger("click");
        });

        it("should invoke the callback", () => {
          expect(callback).to.have.been.called;
        });

        it(`should pass the dialog as "this"`, () => {
          expect(callback.thisValues[0]).to.equal($dialog);
        });

        it("with the correct value", () => {
          expect(callback).to.have.been.calledWithExactly(true);
        });

        it("should hide the modal", () => {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });

      describe("when dismissing the dialog by clicking Cancel", () => {
        before(() => {
          createDialog();
          $(find($dialog, ".bootprompt-cancel")).trigger("click");
        });

        it("should invoke the callback", () => {
          expect(callback).to.have.been.called;
        });

        it(`should pass the dialog as "this"`, () => {
          expect(callback.thisValues[0]).to.equal($dialog);
        });

        it("with the correct value", () => {
          expect(callback).to.have.been.calledWithExactly(false);
        });

        it("should hide the modal", () => {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });

      describe("when triggering the escape event", () => {
        before(() => {
          createDialog();
          $dialog.trigger("escape.close.bp");
        });

        it("should invoke the callback", () => {
          expect(callback).to.have.been.called;
        });

        it(`should pass the dialog as "this"`, () => {
          expect(callback.thisValues[0]).to.equal($dialog);
        });

        it("with the correct value", () => {
          expect(callback).to.have.been.calledWithExactly(false);
        });

        it("should hide the modal", () => {
          expect(hidden).to.have.been.calledWithExactly("hide");
        });
      });
    });

    describe("with a callback which returns false", () => {
      let callback: sinon.SinonStub;
      let hidden: sinon.SinonSpy;
      let $dialog: JQuery;

      function createDialog(): void {
        callback = sinon.stub();
        callback.returns(false);
        $dialog = bootprompt.confirm({
          message: "Are you sure?",
          callback,
        });
        hidden = sinon.spy($dialog, "modal");
      }

      describe("when dismissing the dialog by clicking OK", () => {
        before(() => {
          createDialog();
          $(find($dialog, ".bootprompt-accept")).trigger("click");
        });

        it("should invoke the callback", () => {
          expect(callback).to.have.been.called;
        });

        it(`should pass the dialog as "this"`, () => {
          expect(callback.thisValues[0]).to.equal($dialog);
        });

        it("with the correct value", () => {
          expect(callback).to.have.been.calledWithExactly(true);
        });

        it("should not hide the modal", () => {
          expect(hidden).not.to.have.been.called;
        });
      });

      describe("when dismissing the dialog by clicking Cancel", () => {
        before(() => {
          createDialog();
          $(find($dialog, ".bootprompt-cancel")).trigger("click");
        });

        it("should invoke the callback", () => {
          expect(callback).to.have.been.called;
        });

        it(`should pass the dialog as "this"`, () => {
          expect(callback.thisValues[0]).to.equal($dialog);
        });

        it("with the correct value", () => {
          expect(callback).to.have.been.calledWithExactly(false);
        });

        it("should not hide the modal", () => {
          expect(hidden).not.to.have.been.called;
        });
      });

      describe("when triggering the escape event", () => {
        before(() => {
          createDialog();
          $dialog.trigger("escape.close.bp");
        });

        it("should invoke the callback", () => {
          expect(callback).to.have.been.called;
        });

        it(`should pass the dialog as "this"`, () => {
          expect(callback.thisValues[0]).to.equal($dialog);
        });

        it("with the correct value", () => {
          expect(callback).to.have.been.calledWithExactly(false);
        });

        it("should not hide the modal", () => {
          expect(hidden).not.to.have.been.called;
        });
      });
    });
  });
});
