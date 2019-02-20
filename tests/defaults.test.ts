describe("bootprompt.setDefaults", () => {
  before(() => {
    bootprompt.setDefaults("animate", false);
  });

  describe("animate", () => {
    after(() => {
      // We need to reset it to false after we're done testing it.
      bootprompt.setDefaults("animate", false);
    });

    describe("when set to false", () => {
      let $dialog: JQuery;

      function createDialog(): void {
        bootprompt.setDefaults({
          animate: false,
        });
        $dialog = bootprompt.dialog({
          message: "test",
        });
      }

      before(() => {
        createDialog();
      });

      it("does not add the fade class to the dialog", () => {
        expect($dialog[0].classList.contains("fade")).to.be.false;
      });

      it("applies the correct class to the body", () => {
        expect(document.body.classList.contains("modal-open")).to.be.true;
      });

      describe("when clicking the close button", () => {
        before(() => {
          createDialog();
          $(find($dialog, ".close")).trigger("click");
        });

        it("removes the modal-open class from the body", () => {
          expect(document.body.classList.contains("modal-open")).to.be.false;
        });
      });
    });

    describe("when set to true", () => {
      let $dialog: JQuery;

      before((done) => {
        bootprompt.setDefaults({
          animate: true,
        });
        $dialog = bootprompt.dialog({
          message: "test",
        });

        // We need to wait until the modal is shown. Otherwise, the after hook
        // will run too early.
        $dialog.one("shown.bs.modal", () => {
          done();
        });
      });

      after((done) => {
        $dialog.one("hidden.bs.modal", () => {
          done();
        });

        $dialog.modal("hide");
      });

      it("adds the fade class to the dialog", () => {
        expect($dialog[0].classList.contains("fade")).to.be.true;
      });
    });
  });

  describe("className", () => {
    describe("when passed as a string", () => {
      let $dialog: JQuery;

      before(() => {
        bootprompt.setDefaults({
          className: "my-class",
        });

        $dialog = bootprompt.dialog({
          message: "test",
        });
      });

      it("adds the extra class to the outer dialog", () => {
        expect($dialog[0].classList.contains("bootprompt")).to.be.true;
        expect($dialog[0].classList.contains("my-class")).to.be.true;
      });
    });
  });

  describe("size", () => {
    describe("when set to large", () => {
      let $dialog: JQuery;

      before(() => {
        bootprompt.setDefaults({
          size: "large",
        });

        $dialog = bootprompt.dialog({
          message: "test",
        });
      });

      it("adds the large class to the innerDialog", () => {
        expect(find($dialog, ".modal-dialog").classList.contains("modal-lg"))
          .to.be.true;
      });
    });

    describe("when set to small", () => {
      let $dialog: JQuery;

      before(() => {
        bootprompt.setDefaults({
          size: "small",
        });

        $dialog = bootprompt.dialog({
          message: "test",
        });
      });

      it("adds the small class to the innerDialog", () => {
        expect(find($dialog, ".modal-dialog").classList.contains("modal-sm"))
          .to.be.true;
      });
    });
  });

  describe("backdrop", () => {
    describe("when set to false", () => {
      before(() => {
        // The suite does not systematically cleanup old modals.
        bootprompt.hideAll();
        const backdrops = document.getElementsByClassName("modal-backdrop");
        expect(backdrops).to.be.lengthOf(0);
        bootprompt.setDefaults({
          backdrop: false,
        });

        bootprompt.dialog({
          message: "test",
        });
      });

      it("does not show a backdrop", () => {
        expect(document.getElementsByClassName("modal-backdrop")).to.be
          .lengthOf(0);
      });
    });
  });

  describe("centerVertical", () => {
    describe("when set to true", () => {
      let $dialog: JQuery;

      before(() => {
        bootprompt.setDefaults({
          centerVertical: true,
        });

        $dialog = bootprompt.dialog({
          message: "test",
        });
      });

      it("adds the modal-dialog-centered class to the innerDialog", () => {
        expect(find($dialog, ".modal-dialog").classList
               .contains("modal-dialog-centered")).to.be.true;
      });
    });
  });

  describe("when passed two arguments", () => {
    let $dialog: JQuery;

    before(() => {
      bootprompt.setDefaults("className", "my-class");
      $dialog = bootprompt.dialog({
        message: "test",
      });
    });

    it("applies the arguments as a key/value pair", () => {
      expect($dialog[0].classList.contains("bootprompt")).to.be.true;
      expect($dialog[0].classList.contains("my-class")).to.be.true;
    });
  });

  describe("container", () => {
    describe("when not explicitly set", () => {
      let $dialog: JQuery;

      before(() => {
        $dialog = bootprompt.dialog({
          message: "test",
        });
      });

      it("defaults to the body element", () => {
        expect($dialog[0].parentNode).to.equal(document.body);
      });
    });

    describe("when explicitly set to body", () => {
      let $dialog: JQuery;

      before(() => {
        bootprompt.setDefaults({
          container: "body",
        });

        $dialog = bootprompt.dialog({
          message: "test",
        });
      });

      it("sets the correct parent element", () => {
        expect($dialog[0].parentNode).to.equal(document.body);
      });
    });

    describe("when set to another dom element", () => {
      let $container: JQuery;
      let $dialog: JQuery;

      before(() => {
        $container = $("<div></div>");
        bootprompt.setDefaults({
          container: $container,
        });

        $dialog = bootprompt.dialog({
          message: "test",
        });
      });

      it("sets the correct parent element", () => {
        expect($dialog[0].parentNode).to.equal($container[0]);
      });
    });
  });
});
