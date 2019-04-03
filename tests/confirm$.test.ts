describe("bootprompt.confirm$", () => {
  "use strict";

  // tslint:disable-next-line:mocha-no-side-effect-code
  const MARKER = new Object();

  // tslint:disable-next-line:completed-docs
  class Confirm$Test {
    protected _$dialog!: JQuery;
    protected _promise!: Promise<boolean | null>;
    protected _callback?: sinon.SinonSpy;

    constructor(private readonly makeCallback:
                () => sinon.SinonSpy | undefined) {
    }

    makeDialog(): void {
      // Toss all previous dialogs.
      bootprompt.hideAll();
      const callback = this._callback = this.makeCallback();
      this._promise = bootprompt.confirm$({
        message: "Hello!",
        callback,
      });

      this._$dialog = $(".modal");
    }

    accept(): void {
      this._$dialog.find(".bootprompt-accept").trigger("click");
    }

    cancel(): void {
      this._$dialog.find(".bootprompt-cancel").trigger("click");
    }

    close(): void {
      this._$dialog.find(".close").trigger("click");
    }

    escape(): void {
      this._$dialog.trigger("escape.close.bp");
    }

    shouldHideAndResolve(expectValue: boolean | null): void {
      it("should hide the modal", () => {
        expect(document.querySelector(".modal")).to.be.null;
      });

      it("the promise should resolve", async () => {
        expect(await this._promise).to.equal(expectValue);
      });
    }

    shouldNotHide(): void {
      it("should hide the modal", () => {
        expect(document.querySelector(".modal")).to.equal(this._$dialog[0]);
      });

      it("the promise should not be resolved", async () => {
        expect(await Promise.race([this._promise, MARKER])).to.equal(MARKER);
      });
    }

    shouldInvokeCallback(): void {
      it("should invoke the callback", () => {
        expect(this._callback).to.have.been.called;
      });

      it(`should pass the dialog as "this"`, () => {
        // tslint:disable-next-line:no-non-null-assertion
        expect(this._callback!.thisValues[0][0]).to.equal(this._$dialog[0]);
      });
    }

    // At the time this function is called there's no callback created yet. So
    // at invocation time we have to use the argument to tell whether to check
    // for callback invocation.
    shouldBeDismissed(expectValue: boolean | null,
                      callback: boolean = true): void {
      if (callback) {
        this.shouldInvokeCallback();
      }
      this.shouldHideAndResolve(expectValue);
    }

    shouldNotBeDismissed(callback: boolean = true): void {
      if (callback) {
        this.shouldInvokeCallback();
      }
      this.shouldNotHide();
    }
  }

  function makeDismissTest(name: string,
                           makeCallback: () => sinon.SinonSpy | undefined =
                           () => undefined): void {
    const hasCallback = makeCallback() !== undefined;
    describe(name, () => {
      const test = new Confirm$Test(makeCallback);
      describe("when dismissing the dialog by clicking OK", () => {
        before(() => {
          test.makeDialog();
          test.accept();
        });

        // tslint:disable-next-line:mocha-no-side-effect-code
        test.shouldBeDismissed(true, hasCallback);
      });

      describe("when dismissing the dialog by clicking Cancel", () => {
        before(() => {
          test.makeDialog();
          test.cancel();
        });

        // tslint:disable-next-line:mocha-no-side-effect-code
        test.shouldBeDismissed(false, hasCallback);
      });

      describe("when clicking the close button", () => {
        before(() => {
          test.makeDialog();
          test.close();
        });

        // tslint:disable-next-line:mocha-no-side-effect-code
        test.shouldBeDismissed(false, hasCallback);
      });

      describe("when triggering the escape event", () => {
        before(() => {
          test.makeDialog();
          test.escape();
        });

        // tslint:disable-next-line:mocha-no-side-effect-code
        test.shouldBeDismissed(false, hasCallback);
      });
    });
  }

  before(() => {
    bootprompt.setAnimate(false);
  });

  after(() => {
    // Don't let any errant dialog mess up other tests
    bootprompt.hideAll();
  });

  describe("basic usage tests", () => {
    describe("where the argument is a string", () => {
      let promise: Promise<boolean | null>;
      before(() => {
        promise = bootprompt.confirm$("Hello world!");
        (document.querySelector(".bootprompt-accept") as HTMLElement).click();
      });

      it("should hide the modal", () => {
        expect(document.querySelector(".modal")).to.be.null;
      });

      it("the promise resolves when the dialog is hidden", async () => {
        expect(await promise).to.be.true;
      });
    });

    describe("where the argument is an object", () => {
      let promise: Promise<boolean | null>;
      before(() => {
        promise = bootprompt.confirm$({
          message: "Hello world!",
        });
        (document.querySelector(".bootprompt-accept") as HTMLElement).click();
      });

      it("should hide the modal", () => {
        expect(document.querySelector(".modal")).to.be.null;
      });

      it("the promise resolves when the dialog is hidden", async () => {
        expect(await promise).to.be.true;
      });
    });
  });

  describe("callback tests", () => {
    // tslint:disable-next-line:mocha-no-side-effect-code
    makeDismissTest("with no callback");

    // tslint:disable-next-line:mocha-no-side-effect-code
    makeDismissTest("with a simple callback", () => sinon.spy());

    describe("with a callback which returns false", () => {
      // tslint:disable-next-line:mocha-no-side-effect-code
      const test = new Confirm$Test(() => sinon.stub().returns(false));

      describe("when dismissing the dialog by clicking OK", () => {
        before(() => {
          test.makeDialog();
          test.accept();
        });

        // tslint:disable-next-line:mocha-no-side-effect-code
        test.shouldNotBeDismissed(true);
      });

      describe("when clicking the close button", () => {
        before(() => {
          test.makeDialog();
          test.close();
        });

        // tslint:disable-next-line:mocha-no-side-effect-code
        test.shouldNotBeDismissed(true);
      });

      describe("when triggering the escape event", () => {
        before(() => {
          test.makeDialog();
          test.escape();
        });

        // tslint:disable-next-line:mocha-no-side-effect-code
        test.shouldNotBeDismissed(true);
      });
    });

    describe("with a callback which first returns false, then true", () => {
      // tslint:disable-next-line:mocha-no-side-effect-code
      const test = new Confirm$Test(() => sinon.stub().onFirstCall()
                                    .returns(false).returns(true));

      describe("when dismissing the dialog by clicking OK", () => {
        before(() => {
          test.makeDialog();
          test.cancel();
          test.accept();
        });

        // tslint:disable-next-line:mocha-no-side-effect-code
        test.shouldBeDismissed(true, true);
      });

      describe("when clicking the close button", () => {
        before(() => {
          test.makeDialog();
          test.accept();
          test.close();
        });

        // tslint:disable-next-line:mocha-no-side-effect-code
        test.shouldBeDismissed(false, true);
      });

      describe("when triggering the escape event", () => {
        before(() => {
          test.makeDialog();
          test.accept();
          test.escape();
        });

        // tslint:disable-next-line:mocha-no-side-effect-code
        test.shouldBeDismissed(false, true);
      });
    });
  });
});
