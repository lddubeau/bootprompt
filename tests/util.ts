/* tslint:disable:completed-docs */

function find($dialog: JQuery, selector: string): HTMLElement {
  return $dialog[0].querySelector(selector) as HTMLElement;
}

function text($dialog: JQuery, selector: string): string {
  // tslint:disable-next-line:no-non-null-assertion
  return find($dialog, selector).textContent!;
}

function exists($dialog: JQuery, selector: string): boolean {
  return $dialog[0].querySelector(selector) !== null;
}

function reload(done: () => void): void {
  //
  // What we are doing here is essentially resetting bootprompt.
  //

  // Look for the path to bootprompt.
  // tslint:disable-next-line:no-any
  const files = Object.keys((window as any).__karma__.files);
  let src: string | undefined;
  for (const candidate of files) {
    if (/\/bootprompt\..*\.js$/.test(candidate)) {
      src = candidate;
      break;
    }
  }

  if (src === undefined) {
    throw new Error("couldn't find the path to bootprompt!");
  }

  // Reload it. We don't need to load the locales here.
  const script = document.createElement("script");
  script.addEventListener("load", () => {
    done();
  });
  script.src = src;
  document.body.appendChild(script);
}

class Test {
  protected _$dialog!: JQuery;
  protected _callback!: sinon.SinonSpy;
  protected _hidden!: sinon.SinonSpy<[Bootstrap.ModalOption?], JQuery>;

  constructor(private readonly method: typeof bootprompt.alert |
              typeof bootprompt.confirm | typeof bootprompt.prompt) {
  }

  get $dialog(): JQuery {
    return this._$dialog;
  }

  get callback(): sinon.SinonSpy {
    return this._callback;
  }

  get hidden(): sinon.SinonSpy<[Bootstrap.ModalOption?], JQuery> {
    return this._hidden;
  }

  shouldClose(): void {
    it("should invoke the callback", () => {
      expect(this.callback).to.have.been.calledOnce;
    });

    it(`should pass the dialog as "this"`, () => {
      expect(this.callback.thisValues[0]).to.equal(this.$dialog);
    });

    it("should hide the modal", () => {
      expect(this.hidden).to.have.been.calledOnceWithExactly("hide");
    });
  }

  shouldNotClose(): void {
    it("should not invoke the callback", () => {
      expect(this.callback).to.not.have.been.called;
    });

    it("should not hide the modal", () => {
      expect(this.hidden).to.not.have.been.called;
    });
  }

  makeDialog(onEscape: bootprompt.AlertOptions["onEscape"],
             onClose: bootprompt.AlertOptions["onClose"]): void {
    const callback = this._callback = sinon.spy();
    // TS is unhappy with our types. We use arguments that are common
    // to bootprompt.alert and bootprompt.confirm so...
    const $dialog = this._$dialog = (this.method as typeof bootprompt.alert)({
      title: "Title",
      message: "Hello!",
      callback,
      onEscape,
      onClose,
    });

    this._hidden = sinon.spy($dialog, "modal");
  }
}

// tslint:disable-next-line:max-func-body-length
function makeOnEscapeTests(method: typeof bootprompt.alert |
                           typeof bootprompt.confirm |
                           typeof bootprompt.prompt): void {
  class OnEscapeTestConstant extends Test {
    constructor(private readonly onEscape: boolean) {
      super(method);
    }

    createDialog(): void {
      this.makeDialog(this.onEscape, undefined);
    }
  }

  describe("with a simple callback and onEscape false", () => {
    const test = new OnEscapeTestConstant(false);
    describe("when dismissing the dialog by clicking OK", () => {
      before(() => {
        test.createDialog();
        test.$dialog.find(".bootprompt-accept").trigger("click");
      });

      test.shouldClose();
    });

    describe("when clicking the close button", () => {
      before(() => {
        test.createDialog();
        test.$dialog.find(".close").trigger("click");
      });

      test.shouldClose();
    });

    describe("when triggering the escape event", () => {
      before(() => {
        test.createDialog();
        test.$dialog.trigger("escape.close.bp");
      });

      test.shouldNotClose();
    });
  });

  describe("with a simple callback and onEscape true", () => {
    const test = new OnEscapeTestConstant(true);
    describe("when dismissing the dialog by clicking OK", () => {
      before(() => {
        test.createDialog();
        test.$dialog.find(".bootprompt-accept").trigger("click");
      });

      test.shouldClose();
    });

    describe("when clicking the close button", () => {
      before(() => {
        test.createDialog();
        test.$dialog.find(".close").trigger("click");
      });

      test.shouldClose();
    });

    describe("when triggering the escape event", () => {
      before(() => {
        test.createDialog();
        test.$dialog.trigger("escape.close.bp");
      });

      test.shouldClose();
    });
  });

  class OnEscapeTestCallback extends Test {
    protected _onEscape!: sinon.SinonStub;

    get onEscape(): sinon.SinonStub {
      return this._onEscape;
    }

    // tslint:disable-next-line:no-any
    constructor(private readonly returnValue: any) {
      super(method);
    }

    createDialog(): void {
      const onEscape = this._onEscape = sinon.stub();
      onEscape.returns(this.returnValue);
      this.makeDialog(onEscape, undefined);
    }

    shouldNotInvokeOnEscape(): void {
      it("should not invoke the onEscape callback", () => {
        expect(this.onEscape).to.not.have.been.called;
      });
    }

    shouldInvokeOnEscape(): void {
      it("should invoke the onEscape callback", () => {
        expect(this.onEscape).to.have.been.calledOnce;
      });

      it(`should pass the onEscape callback the dialog as "this"`, () => {
        expect(this.onEscape.thisValues[0]).to.equal(this.$dialog);
      });

      it("should pass an event to the onEscape callback", () => {
        expect(this.onEscape.args[0][0]).to.be.instanceof($.Event);
      });
    }
  }

  describe("with a simple callback and onEscape () => false", () => {
    const test = new OnEscapeTestCallback(false);
    describe("when dismissing the dialog by clicking OK", () => {
      before(() => {
        test.createDialog();
        test.$dialog.find(".bootprompt-accept").trigger("click");
      });

      test.shouldNotInvokeOnEscape();
      test.shouldClose();
    });

    describe("when clicking the close button", () => {
      before(() => {
        test.createDialog();
        test.$dialog.find(".close").trigger("click");
      });

      test.shouldNotInvokeOnEscape();
      test.shouldClose();
    });

    describe("when triggering the escape event", () => {
      before(() => {
        test.createDialog();
        test.$dialog.trigger("escape.close.bp");
      });

      test.shouldInvokeOnEscape();
      test.shouldNotClose();
    });
  });

  describe("with a simple callback and onEscape () => true", () => {
    const test = new OnEscapeTestCallback(true);

    describe("when dismissing the dialog by clicking OK", () => {
      before(() => {
        test.createDialog();
        test.$dialog.find(".bootprompt-accept").trigger("click");
      });

      test.shouldNotInvokeOnEscape();
      test.shouldClose();
    });

    describe("when clicking the close button", () => {
      before(() => {
        test.createDialog();
        test.$dialog.find(".close").trigger("click");
      });

      test.shouldNotInvokeOnEscape();
      test.shouldClose();
    });

    describe("when triggering the escape event", () => {
      before(() => {
        test.createDialog();
        test.$dialog.trigger("escape.close.bp");
      });

      test.shouldInvokeOnEscape();
      test.shouldClose();
    });
  });
}

// tslint:disable-next-line:max-func-body-length
function makeOnCloseTests(method: typeof bootprompt.alert |
                          typeof bootprompt.confirm |
                          typeof bootprompt.prompt): void {
  class OnCloseTestCallback extends Test {
    protected _onClose!: sinon.SinonStub;

    get onClose(): sinon.SinonStub {
      return this._onClose;
    }

    // tslint:disable-next-line:no-any
    constructor(private readonly returnValue: any) {
      super(method);
    }

    createDialog(): void {
      const onClose = this._onClose = sinon.stub();
      onClose.returns(this.returnValue);
      this.makeDialog(undefined, onClose);
    }

    shouldNotInvokeOnClose(): void {
      it("should not invoke the onClose callback", () => {
        expect(this.onClose).to.not.have.been.called;
      });
    }

    shouldInvokeOnClose(): void {
      it("should invoke the onClose callback", () => {
        expect(this.onClose).to.have.been.calledOnce;
      });

      it(`should pass the onClose callback the dialog as "this"`, () => {
        expect(this.onClose.thisValues[0]).to.equal(this.$dialog);
      });

      it("should pass an event to the onClose callback", () => {
        expect(this.onClose.args[0][0]).to.be.instanceof($.Event);
      });
    }
  }

  describe("with a simple callback and onClose () => false", () => {
    const test = new OnCloseTestCallback(false);
    describe("when dismissing the dialog by clicking OK", () => {
      before(() => {
        test.createDialog();
        test.$dialog.find(".bootprompt-accept").trigger("click");
      });

      test.shouldNotInvokeOnClose();
      test.shouldClose();
    });

    describe("when clicking the close button", () => {
      before(() => {
        test.createDialog();
        test.$dialog.find(".close").trigger("click");
      });

      test.shouldInvokeOnClose();
      test.shouldNotClose();
    });

    describe("when triggering the escape event", () => {
      before(() => {
        test.createDialog();
        test.$dialog.trigger("escape.close.bp");
      });

      test.shouldNotInvokeOnClose();
      test.shouldClose();
    });
  });

  describe("with a simple callback and onClose () => true", () => {
    const test = new OnCloseTestCallback(true);

    describe("when dismissing the dialog by clicking OK", () => {
      before(() => {
        test.createDialog();
        test.$dialog.find(".bootprompt-accept").trigger("click");
      });

      test.shouldNotInvokeOnClose();
      test.shouldClose();
    });

    describe("when clicking the close button", () => {
      before(() => {
        test.createDialog();
        test.$dialog.find(".close").trigger("click");
      });

      test.shouldInvokeOnClose();
      test.shouldClose();
    });

    describe("when triggering the escape event", () => {
      before(() => {
        test.createDialog();
        test.$dialog.trigger("escape.close.bp");
      });

      test.shouldNotInvokeOnClose();
      test.shouldClose();
    });
  });
}
