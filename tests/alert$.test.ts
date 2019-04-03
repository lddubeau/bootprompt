describe("bootprompt.alert$", () => {
  "use strict";

  // tslint:disable-next-line:mocha-no-side-effect-code
  const MARKER = new Object();

  // tslint:disable-next-line:completed-docs
  class Alert$Test {
    protected _$dialog!: JQuery;
    protected _promise!: Promise<void>;
    protected _callback?: sinon.SinonSpy;

    constructor(private readonly makeCallback:
                () => sinon.SinonSpy | undefined) {
    }

    makeDialog(): void {
      // Toss all previous dialogs.
      bootprompt.hideAll();
      const callback = this._callback = this.makeCallback();
      this._promise = bootprompt.alert$({
        message: "Hello!",
        callback,
      });

      this._$dialog = $(".modal");
    }

    accept(): void {
      this._$dialog.find(".bootprompt-accept").trigger("click");
    }

    close(): void {
      this._$dialog.find(".close").trigger("click");
    }

    escape(): void {
      this._$dialog.trigger("escape.close.bp");
    }

    shouldHideAndResolve(): void {
      it("should hide the modal", () => {
        expect(document.querySelector(".modal")).to.be.null;
      });

      it("the promise should resolve", async () => {
        await this._promise;
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
    shouldBeDismissed(callback: boolean = true): void {
      if (callback) {
        this.shouldInvokeCallback();
      }
      this.shouldHideAndResolve();
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
      const test = new Alert$Test(makeCallback);
      describe("when dismissing the dialog by clicking OK", () => {
        before(() => {
          test.makeDialog();
          test.accept();
        });

        // tslint:disable-next-line:mocha-no-side-effect-code
        test.shouldBeDismissed(hasCallback);
      });

      describe("when clicking the close button", () => {
        before(() => {
          test.makeDialog();
          test.close();
        });

        // tslint:disable-next-line:mocha-no-side-effect-code
        test.shouldBeDismissed(hasCallback);
      });

      describe("when triggering the escape event", () => {
        before(() => {
          test.makeDialog();
          test.escape();
        });

        // tslint:disable-next-line:mocha-no-side-effect-code
        test.shouldBeDismissed(hasCallback);
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
      let promise: Promise<void>;
      before(() => {
        promise = bootprompt.alert$("Hello world!");
        (document.querySelector(".bootprompt-accept") as HTMLElement).click();
      });

      it("should hide the modal", () => {
        expect(document.querySelector(".modal")).to.be.null;
      });

      it("the promise resolves when the dialog is hidden", async () => {
        await promise;
      });
    });

    describe("where the argument is an object", () => {
      let promise: Promise<void>;
      before(() => {
        promise = bootprompt.alert$({
          message: "Hello world!",
        });
        (document.querySelector(".bootprompt-accept") as HTMLElement).click();
      });

      it("should hide the modal", () => {
        expect(document.querySelector(".modal")).to.be.null;
      });

      it("the promise resolves when the dialog is hidden", async () => {
        await promise;
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
      const test = new Alert$Test(() => sinon.stub().returns(false));

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
  });
});
